import { Component, OnInit } from '@angular/core';
import { TicketTypeService } from '../../../shared/services/admin-ticket-type.service';
import { CommonModule } from '@angular/common';
import {
  TicketType,
  TicketTypeListResponse,
} from '../../../shared/interface/ticket-type.interface';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Event } from '../../../shared/interface/event.interface';
import { EventService } from '../../../shared/services/admin-event.service';

@Component({
  selector: 'app-ticket-types',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-types.component.html',
  styleUrls: ['./ticket-types.component.css'],
})
export class TicketTypesComponent implements OnInit {
  events: Event[] = [];
  ticketTypes: TicketType[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  isLoading = true;
  Math = Math;
  ticketTypeForm: FormGroup;

  constructor(
    private ticketTypeService: TicketTypeService,
    private eventService: EventService,
    private fb: FormBuilder
  ) {
    this.ticketTypeForm = this.fb.group({
      EventId: ['', [Validators.required]],
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      Price: ['', [Validators.required, Validators.min(0)]],
      Quantity: ['', [Validators.required, Validators.min(1)]],
      Description: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.loadTicketTypes();
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEvents(1, 100).subscribe({
      next: (response) => {
        this.events = response.Items?.EventResponse || [];
      },
      error: (error) => {
        console.error('Error loading events:', error);
      },
    });
  }

  loadTicketTypes(): void {
    this.isLoading = true;
    this.ticketTypeService
      .getAllTicketTypes(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: TicketTypeListResponse) => {
          this.ticketTypes = response.Items?.TicketTypeResponse || [];
          this.totalItems = response.TotalCount || 0;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading ticket types:', error);
          this.isLoading = false;
        },
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTicketTypes();
  }

  showCreateModal(): void {
    // Verificar que hay eventos cargados
    if (this.events.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Primero debe cargar los eventos disponibles',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    Swal.fire({
      title: 'Crear Nuevo Tipo de Ticket',
      html: `
      <div class="w-full max-w-4xl space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Evento</label>
          <select id="swal-event-id" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            ${this.events
              .map(
                (event) =>
                  `<option value="${event.Id}">${event.Name} (${new Date(
                    event.Date
                  ).toLocaleDateString()})</option>`
              )
              .join('')}
          </select>
        </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input id="swal-name" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Nombre del tipo de ticket">
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input id="swal-price" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Precio">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input id="swal-quantity" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Cantidad disponible">
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea id="swal-description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Descripción del tipo de ticket"></textarea>
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
          EventId: parseInt(
            (document.getElementById('swal-event-id') as HTMLInputElement).value
          ),
          Name: (document.getElementById('swal-name') as HTMLInputElement)
            .value,
          Price: parseFloat(
            (document.getElementById('swal-price') as HTMLInputElement).value
          ),
          Quantity: parseInt(
            (document.getElementById('swal-quantity') as HTMLInputElement).value
          ),
          Description: (
            document.getElementById('swal-description') as HTMLTextAreaElement
          ).value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newTicketType = result.value;
        this.createTicketType(newTicketType);
      }
    });
  }

  createTicketType(ticketTypeData: any): void {
    this.ticketTypeService.createTicketType(ticketTypeData).subscribe({
      next: (response) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Tipo de ticket creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        this.loadTicketTypes();
      },
      error: (error) => {
        console.error('Error creating ticket type:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo crear el tipo de ticket',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  showEditModal(ticketType: TicketType): void {
    if (this.events.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Primero debe cargar los eventos disponibles',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    Swal.fire({
      title: 'Editar Tipo de Ticket',
      html: `
      <div class="w-full max-w-4xl space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Evento</label>
          <select id="swal-edit-event-id" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            ${this.events
              .map(
                (event) =>
                  `<option value="${event.Id}" ${
                    event.Id === ticketType.EventId ? 'selected' : ''
                  }>
                ${event.Name} (${new Date(event.Date).toLocaleDateString()})
              </option>`
              )
              .join('')}
          </select>
        </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input id="swal-edit-name" value="${
              ticketType.Name
            }" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Nombre del tipo de ticket">
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input id="swal-edit-price" type="number" step="0.01" value="${
              ticketType.Price
            }" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Precio">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input id="swal-edit-quantity" type="number" value="${
              ticketType.Quantity
            }" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Cantidad disponible">
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea id="swal-edit-description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Descripción del tipo de ticket">${
            ticketType.Description
          }</textarea>
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
          Id: ticketType.Id,
          EventId: parseInt(
            (document.getElementById('swal-edit-event-id') as HTMLInputElement)
              .value
          ),
          Name: (document.getElementById('swal-edit-name') as HTMLInputElement)
            .value,
          Price: parseFloat(
            (document.getElementById('swal-edit-price') as HTMLInputElement)
              .value
          ),
          Quantity: parseInt(
            (document.getElementById('swal-edit-quantity') as HTMLInputElement)
              .value
          ),
          Description: (
            document.getElementById(
              'swal-edit-description'
            ) as HTMLTextAreaElement
          ).value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTicketType = result.value;
        this.updateTicketType(updatedTicketType);
      }
    });
  }

  updateTicketType(ticketTypeData: any): void {
    this.ticketTypeService.updateTicketType(ticketTypeData).subscribe({
      next: (response) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Tipo de ticket actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        this.loadTicketTypes();
      },
      error: (error) => {
        console.error('Error updating ticket type:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el tipo de ticket',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  showTicketTypeDetails(id: number): void {
    this.ticketTypeService.getTicketTypeById(id).subscribe({
      next: (ticketType: TicketType) => {
        this.showTicketTypeModal(ticketType);
      },
      error: (error) => {
        console.error('Error fetching ticket type details:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la información del tipo de ticket',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  private showTicketTypeModal(ticketType: TicketType): void {
    const event = this.events.find((e) => e.Id === ticketType.EventId);

    Swal.fire({
      title: ticketType.Name,
      html: `
      <div class="w-full max-w-4xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-700">Descripción</h3>
              <p class="mt-1 text-gray-600">${ticketType.Description}</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-700">Nombre del Evento</h3>
              <p class="mt-1 text-gray-600">${
                event ? event.Name : 'Evento no encontrado'
              }</p>

            </div>
          </div>
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-700">Precio</h3>
              <p class="mt-1 text-gray-600">$${ticketType.Price.toFixed(2)}</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-700">Cantidad Disponible</h3>
              <p class="mt-1 text-gray-600">${ticketType.Quantity}</p>
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

  deleteTicketType(id: number): void {
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
        this.ticketTypeService.deleteTicketType(id).subscribe({
          next: () => {
            Swal.fire(
              '¡Eliminado!',
              'El tipo de ticket ha sido eliminado.',
              'success'
            );
            this.loadTicketTypes();
          },
          error: (error) => {
            console.error('Error deleting ticket type:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el tipo de ticket',
              'error'
            );
          },
        });
      }
    });
  }

  getEventName(eventId: number): string {
    const event = this.events.find((e) => e.Id === eventId);
    return event ? `${event.Name}` : `ID: ${eventId}`;
  }
}
