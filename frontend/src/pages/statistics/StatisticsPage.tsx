import { useEffect } from "react";
import useApi from "../../api/useApi";
import useUserContext from "../../hooks/useUserContext";

export interface Statistics {
  most_active_month: string;
  average_entries_per_week: number;
  total_word_count: number;
}

export default function StatisticsPage() {
  const { user } = useUserContext();
  const myToken = user?.authToken;

  const { isLoading, error, data, fetchData } = useApi<Statistics>({
    url: "/entry/getJournalStatistics/",
    method: "GET",
    headers: {
      Authorization: `Token ${myToken}`,
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <>
        <div>Error: {error.message}</div>
        <div>{JSON.stringify(error.response?.data)}</div>
      </>
    );
  }

  if (!data) {
    return <div>Data not found</div>;
  }

  return (
    <div>
      <h1>Statistics</h1>
      <div>
        <div>
          <label htmlFor="most_active_month">Most active month:</label>
          <input
            type="text"
            id="most_active_month"
            name="most_active_month"
            value={data.most_active_month}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="average_entries_per_week">
            Average entries per week:
          </label>
          <input
            type="text"
            id="average_entries_per_week"
            name="average_entries_per_week"
            value={data.average_entries_per_week}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="total_word_count">Total word count:</label>
          <input
            type="text"
            id="total_word_count"
            name="total_word_count"
            value={data.total_word_count}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
