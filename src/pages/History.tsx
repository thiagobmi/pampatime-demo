import Header from '../components/Header';
import WeeklyCalendar from '../components/history/WeeklyCalendar';
import EditHistory from '../components/history/EditHistory';
import HistoryToolbar from '../components/history/HistoryToolbar'; // precisa criar esse componente

const History = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex flex-col flex-1 overflow-hidden">
        <HistoryToolbar /> {/* <-- barra logo abaixo do header */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <WeeklyCalendar />
          </div>
          <EditHistory />
        </div>
      </main>
    </div>
  );
};

export default History;
