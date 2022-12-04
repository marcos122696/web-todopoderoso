import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
// import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import { onAddNewEvent, 
    onSetActiveEvent, 
    onUpdateEvent, 
    onDeleteEvent,
    onLoadEvents } from "../store";


export const useCalendarStore = () => {
  
    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth );
  
    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent(calendarEvent) );
    };
  
    const startSavingEvent = async( calendarEvent ) => {
        // console.log('evento' + calendarEvent);
        try {
            if ( calendarEvent.id ) {
                // Actualizando...
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent );
                dispatch( onUpdateEvent({ ...calendarEvent, user }) );
                return;
            } 
            // Creando...
            const { data } = await calendarApi.post('/events', calendarEvent);
            // console.log(data);
            dispatch( onAddNewEvent({ ...calendarEvent, id: data.event.id, user }) );
        } catch (error) {
            // console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
            
        }
        
    };

    const startDelitingEvent = async() => {
        try {

                await calendarApi.delete(`/events/${activeEvent.id}`);
                dispatch( onDeleteEvent() );

        } catch (error) {
            // console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');
            
        }
    };

    const startLoadingEvents = async() => {
        try {

            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents( data.events );
            dispatch( onLoadEvents( events ) );
            
        } catch (error) {
            // console.log('Error al cargar eventos');
            // console.log(error);
        }
    };
    
  
  
    return {
        //* Propiedades
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        //* Metodos
        setActiveEvent,
        startSavingEvent,
        startDelitingEvent,
        startLoadingEvents,
  }
}
