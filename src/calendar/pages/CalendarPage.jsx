import { useEffect } from 'react';
import { useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { NavBar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from "../";
import { getMessagesES, localizer } from '../../helpers';
import { useCalendarStore, useUiStore, useAuthStore } from '../../hooks';


export const CalendarPage = () => {

    const { user } = useAuthStore();
    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
    const { openDateModal } = useUiStore();
    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month' );

    const eventStyleGetter = ( event/* , start, end, isSelected  */) => {

        const isMyEvent = ( (user.uid === event.user._id) || (user.uid === event.user.uid) );

        const style = {
            backgroundColor: isMyEvent ? '#4A903B' : '#333',
            borderRadius: '0px',
            opacy: 0.8,
            color:'white',
        }

        return {
            style
        }
    };

    const onDoubleClick = () => {
        openDateModal();
    };
    const onSelect = (event) => {
        setActiveEvent( event );
    };
    const onViewChanged = (event) => {
        // console.log(event);
        localStorage.setItem('lastView', event );
        setLastView( event );
    };

    useEffect(() => {
        startLoadingEvents();
    }, []);
    

  return (
    <>
        <NavBar/>

        <Calendar
            className='p-1'
            culture='es'
            localizer={localizer}
            events={events}
            defaultView={ lastView }
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'calc( 100vh - 80px )' }}
            messages={ getMessagesES() }
            eventPropGetter={ eventStyleGetter }
            components={{
                event: CalendarEvent
            }}
            onDoubleClickEvent={ onDoubleClick }
            onSelectEvent={ onSelect }
            onView={ onViewChanged }
        />

        <CalendarModal/>
        <FabAddNew />
        <FabDelete/>
    </>
  )
}
