import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../shared/services/admin-event.service';
import { CommonModule } from '@angular/common';
import {
  Event,
  EventListResponse,
} from '../../../shared/interface/event.interface';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  isLoading = true;
  Math = Math;
  eventForm: FormGroup;

  constructor(private eventService: EventService, private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      Description: ['', [Validators.required, Validators.maxLength(500)]],
      Date: ['', [Validators.required]],
      Location: ['', [Validators.required, Validators.maxLength(100)]],
      ImageUrl: [''],
      Status: ['active'],
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getAllEvents(this.currentPage, this.pageSize).subscribe({
      next: (response: EventListResponse) => {
        // Ajusta según la estructura real de tu respuesta
        // console.log('Respuesta completa:', response);

        // Ajuste para la estructura real de la respuesta
        this.events = response.Items?.EventResponse || [];
        this.totalItems = response.TotalCount || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEvents();
  }

  showCreateModal(): void {
    Swal.fire({
      title: 'Crear Nuevo Evento',
      html: `
      <div class="w-full max-w-4xl space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input id="swal-name" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Nombre del evento">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input id="swal-location" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Ubicación">
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea id="swal-description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Descripción del evento"></textarea>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
            <input id="swal-date" type="datetime-local" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Imagen URL</label>
            <input id="swal-image" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="URL de la imagen">
          </div>
        </div>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: '!max-w-5xl !w-[90%] !bg-white !rounded-xl !shadow-xl',
        title: '!text-2xl !font-bold !text-gray-800 !mb-6',
        confirmButton:
          '!bg-green-500 !hover:bg-green-600 !text-white !px-6 !py-2 !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-green-300',
        cancelButton:
          '!bg-gray-200 !hover:bg-gray-300 !text-gray-800 !px-6 !py-2 !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-gray-300',
        actions: '!mt-6 !gap-3',
      },
      width: 'auto',
      padding: '2rem',
      preConfirm: () => {
        return {
          Name: (document.getElementById('swal-name') as HTMLInputElement)
            .value,
          Description: (
            document.getElementById('swal-description') as HTMLTextAreaElement
          ).value,
          Date: (document.getElementById('swal-date') as HTMLInputElement)
            .value,
          Location: (
            document.getElementById('swal-location') as HTMLInputElement
          ).value,
          ImageUrl: (document.getElementById('swal-image') as HTMLInputElement)
            .value,
          Status: 'active',
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newEvent = result.value;
        this.createEvent(newEvent);
      }
    });
  }

  createEvent(eventData: any): void {
    // Formatear la fecha para el servicio SOAP
    const formattedEvent = {
      ...eventData,
      Date: new Date(eventData.Date).toISOString(),
    };

    this.eventService.createEvent(formattedEvent).subscribe({
      next: (response) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Evento creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        this.loadEvents();
      },
      error: (error) => {
        console.error('Error creating event:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo crear el evento',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  showEditModal(event: Event): void {
    Swal.fire({
      title: 'Editar Evento',
      html: `
      <div class="w-full max-w-4xl space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input id="swal-edit-name" value="${
              event.Name
            }" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Nombre del evento">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input id="swal-edit-location" value="${
              event.Location
            }" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Ubicación">
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea id="swal-edit-description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Descripción del evento">${
            event.Description
          }</textarea>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
            <input id="swal-edit-date" type="datetime-local" value="${this.formatDateTimeForInput(
              event.Date
            )}" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Imagen URL</label>
            <input id="swal-edit-image" value="${
              event.ImageUrl || ''
            }" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="URL de la imagen">
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select id="swal-edit-status" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="active" ${
              event.Status === 'active' ? 'selected' : ''
            }>Activo</option>
            <option value="inactive" ${
              event.Status === 'inactive' ? 'selected' : ''
            }>Inactivo</option>
            <option value="canceled" ${
              event.Status === 'canceled' ? 'selected' : ''
            }>Cancelado</option>
          </select>
        </div>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: '!max-w-5xl !w-[90%] !bg-white !rounded-xl !shadow-xl',
        title: '!text-2xl !font-bold !text-gray-800 !mb-6',
        confirmButton:
          '!bg-blue-500 !hover:bg-blue-600 !text-white !px-6 !py-2 !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-300',
        cancelButton:
          '!bg-gray-200 !hover:bg-gray-300 !text-gray-800 !px-6 !py-2 !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-gray-300',
        actions: '!mt-6 !gap-3',
      },
      width: 'auto',
      padding: '2rem',
      preConfirm: () => {
        return {
          Id: event.Id,
          Name: (document.getElementById('swal-edit-name') as HTMLInputElement)
            .value,
          Description: (
            document.getElementById(
              'swal-edit-description'
            ) as HTMLTextAreaElement
          ).value,
          Date: (document.getElementById('swal-edit-date') as HTMLInputElement)
            .value,
          Location: (
            document.getElementById('swal-edit-location') as HTMLInputElement
          ).value,
          ImageUrl: (
            document.getElementById('swal-edit-image') as HTMLInputElement
          ).value,
          Status: (
            document.getElementById('swal-edit-status') as HTMLSelectElement
          ).value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedEvent = result.value;
        this.updateEvent(updatedEvent);
      }
    });
  }

  private formatDateTimeForInput(dateString: string): string {
    const date = new Date(dateString);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().slice(0, 16);
  }

  updateEvent(eventData: any): void {
    // Formatear la fecha para el servicio SOAP
    const formattedEvent = {
      ...eventData,
      Date: new Date(eventData.Date).toISOString(),
    };

    this.eventService.updateEvent(formattedEvent).subscribe({
      next: (response) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Evento actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        this.loadEvents();
      },
      error: (error) => {
        console.error('Error updating event:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el evento',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  showEventDetails(id: number): void {
    this.eventService.getEventById(id).subscribe({
      next: (event: Event) => {
        this.showEventModal(event);
      },
      error: (error) => {
        console.error('Error fetching event details:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la información del evento',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  private showEventModal(event: Event): void {
    const statusClass =
      {
        active: 'text-green-600',
        inactive: 'text-gray-600',
        canceled: 'text-red-600',
      }[event.Status] || 'text-gray-600';

    Swal.fire({
      title: event.Name,
      html: `
      <div class="w-full max-w-4xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-700">Descripción</h3>
              <p class="mt-1 text-gray-600">${event.Description}</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-700">Fecha</h3>
              <p class="mt-1 text-gray-600">${new Date(
                event.Date
              ).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-700">Hora</h3>
              <p class="mt-1 text-gray-600">${new Date(
                event.Date
              ).toLocaleTimeString()}</p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-700">Ubicación</h3>
              <p class="mt-1 text-gray-600">${event.Location}</p>
            </div>
            <div>
            <h3 class="text-lg font-semibold text-gray-700">Estado</h3>
            <p class="mt-1 ${statusClass} font-medium">${this.getStatusText(
        event.Status
      )}</p>
          </div>
            <div class="mt-4">
              <img src="${event.ImageUrl || 'assets/default-event.jpg'}" 
                   alt="${event.Name}" 
                   class="w-full h-48 object-cover rounded-lg shadow-md">
            </div>
          </div>
        </div>
      </div>
    `,
      showConfirmButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Cerrar',
      customClass: {
        popup: '!max-w-5xl !w-[90%] !bg-white !rounded-xl !shadow-xl',
        title: '!text-2xl !font-bold !text-gray-800 !mb-4',
        confirmButton:
          '!bg-blue-500 !hover:bg-blue-600 !text-white !px-6 !py-2 !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-300',
        closeButton: '!text-gray-400 !hover:text-gray-600',
      },
      width: 'auto',
      padding: '2rem',
      background: '#ffffff',
      backdrop: 'rgba(0,0,0,0.5)',
      showCloseButton: true,
      focusConfirm: false,
    });
  }

  public getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      active: 'Activo',
      inactive: 'Inactivo',
      canceled: 'Cancelado',
    };
    return statusMap[status] || status;
  }

  deleteEvent(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar',
      reverseButtons: true,
      customClass: {
        popup: 'delete-confirm-modal',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El evento ha sido eliminado.', 'success');
            this.loadEvents();
          },
          error: (error) => {
            console.error('Error deleting event:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el evento',
              'error'
            );
          },
        });
      }
    });
  }

  confirmCancelEvent(id: number): void {
    Swal.fire({
      title: '¿Cancelar este evento?',
      text: 'Esta acción cambiará el estado del evento a "Cancelado". ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, volver',
      allowOutsideClick: false,
      customClass: {
        popup: 'delete-confirm-modal',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelEvent(id);
      }
    });
  }

  cancelEvent(id: number): void {
    this.eventService.cancelEventById(id).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Evento cancelado!',
          text: 'El evento ha sido marcado como cancelado',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        this.loadEvents(); // Recargar la lista de eventos
      },
      error: (error) => {
        console.error('Error canceling event:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cancelar el evento',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }
}
