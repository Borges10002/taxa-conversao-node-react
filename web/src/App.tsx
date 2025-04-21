import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "./lib/api";

interface ConversionData {
  date: string;
  conversion_rate: number;
  formattedDate?: string;
}

function App() {
  const [data, setData] = useState<ConversionData[]>([]);
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        channel: channel || "",
        status: status || "",
        startDate: startDate || "",
        endDate: endDate || "",
      };
      const response = await api.get<{ conversion: ConversionData[] }>(
        "/api/conversion",
        {
          params,
        }
      );

      const formattedData = response.data.conversion.map((item) => ({
        ...item,
        formattedDate: new Date(item.date).toLocaleDateString("pt-BR"),
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Erro ao buscar dados de conversão:", error);
      setError(
        "Erro ao carregar dados. Verifique a conexão e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="p-6 max-w-4xl mx-auto bg-gradient-to-r from-indigo-100 via-purple-200 to-pink-300">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">
          Taxa de Conversão por Canal
        </h1>

        {/* Exibe erro, se houver */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Exibe o loading */}
        {loading && (
          <div className="text-center mb-4 text-blue-600">
            Carregando dados...
          </div>
        )}

        {/* Filtros de entrada */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Canal"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
          <input
            type="text"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
          <input
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
          <button
            onClick={fetchData}
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Carregando..." : "Filtrar"}
          </button>
        </div>

        {/* Exibe gráfico se houver dados */}
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                label={{ value: "Data", position: "bottom", offset: 0 }}
              />
              <YAxis
                label={{
                  value: "Taxa de Conversão (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)}%`, "Taxa"]}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="conversion_rate"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          !loading && (
            <div className="text-center text-gray-600">
              Nenhum dado disponível
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
