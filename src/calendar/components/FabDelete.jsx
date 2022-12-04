import { useCalendarStore, useUiStore } from "../../hooks";

export const FabDelete = () => {
                        
    const { startDelitingEvent, hasEventSelected   } = useCalendarStore();
    const { isDateModalOpen } = useUiStore();
    // console.log('modal abierto:' + isDateModalOpen);
    // console.log('EVENTO ACTIVO: ' + hasEventSelected);

    const handleDelete = () => {
        startDelitingEvent();
    };

  return (
    <button
        className="btn btn-outline-danger fab-danger"
        onClick={ handleDelete }
        style={{ display: hasEventSelected && !isDateModalOpen  ? '' : 'none' }}
    >
        <i className="fas fa-trash-alt"></i>
    </button>
  )
}
