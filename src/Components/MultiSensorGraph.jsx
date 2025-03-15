import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import axios from "axios";

const MultiSensorGraph = () => {
  const [graphData, setGraphData] = useState([]);
  const [timeRange, setTimeRange] = useState("day");
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;

    const fetchSensorData = async () => {
      try {
        const sensorTypes = ["Temperature", "Humidity", "SoilMoisture"];
        const allData = {};

        await Promise.all(
          sensorTypes.map(async (sensorType) => {
            const response = await axios.get(
              `http://localhost:8080/api/sensor/${sensorType}?filter=${timeRange}`
            );
            allData[sensorType] = response.data;
          })
        );

        const mergedData = [];
        allData.Temperature.forEach((tempEntry, index) => {
          mergedData.push({
            timestamp: tempEntry.timestamp,
            Temperature: tempEntry.value,
            Humidity: allData.Humidity?.[index]?.value || null,
            SoilMoisture: allData.SoilMoisture?.[index]?.value || null,
          });
        });

        if (timeRange === "day") {
          setGraphData((prevData) => {
            const combinedData = [...prevData, ...mergedData];
            return combinedData.slice(-15);
          });
        } else {
          setGraphData(mergedData);
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchSensorData();
    intervalId = setInterval(fetchSensorData, timeRange === "day" ? 10000 : 60000);

    return () => clearInterval(intervalId);
  }, [timeRange]);

  const formatXAxis = (timestamp) => {
    if (!timestamp) return "";
    const date = dayjs(timestamp);
    switch (timeRange) {
      case "day":
        return date.format("HH:mm");
      case "week":
        return date.format("DD MMM");
      case "month":
        return date.format("W [week]");
      default:
        return date.format("HH:mm");
    }
  };

  // Function to calculate summary statistics
  const getSummary = (key) => {
    const values = graphData.map((item) => item[key]).filter((val) => val !== null);
    if (values.length === 0) return { count: 0, avg: 0, min: 0, max: 0 };

    const count = values.length;
    const avg = (values.reduce((sum, val) => sum + val, 0) / count).toFixed(2);
    const min = Math.min(...values).toFixed(2);
    const max = Math.max(...values).toFixed(2);

    return { count, avg, min, max };
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-200">
      <div className="flex justify-between items-center mb-6">
        {/* <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
        >
          Back to Home
        </button> */}
        <div className="flex items-center gap-4">
          <label htmlFor="time-range" className="font-medium text-gray-300">
            Time Range:
          </label>
          <select
            id="time-range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border border-gray-600 bg-gray-800 text-white rounded"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 4 Weeks</option>
          </select>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-100">
        Multi-Sensor Real-Time Readings
      </h2>

      {/* Graph Section */}
      <div className="bg-gray-800 p-4 rounded shadow-md">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              stroke="#A1A1AA"
            />
            <YAxis stroke="#A1A1AA" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                borderColor: "#38BDF8",
                color: "#E5E7EB",
              }}
            />
            <Legend />

            <Line
              type="monotone"
              dataKey="Temperature"
              stroke="#FF4500"
              dot={false}
              name="Temperature"
            />
            <Line
              type="monotone"
              dataKey="Humidity"
              stroke="#1E90FF"
              dot={false}
              name="Humidity"
            />
            <Line
              type="monotone"
              dataKey="SoilMoisture"
              stroke="#32CD32"
              dot={false}
              name="Soil Moisture"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Section */}
      {graphData.length > 0 && (
        <div className="mt-6 bg-gray-800 p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-3">Data Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Temperature", "Humidity", "SoilMoisture"].map((sensor) => {
              const summary = getSummary(sensor);
              return (
                <div key={sensor} className="bg-gray-700 p-4 rounded shadow">
                  <h4 className="text-xl font-semibold text-center">
                    {sensor}
                  </h4>
                  <p className="text-sm text-gray-400">Data Points</p>
                  <p className="text-xl font-bold">{summary.count}</p>
                  <p className="text-sm text-gray-400">Average</p>
                  <p className="text-xl font-bold">{summary.avg}</p>
                  <p className="text-sm text-gray-400">Min Value</p>
                  <p className="text-xl font-bold">{summary.min}</p>
                  <p className="text-sm text-gray-400">Max Value</p>
                  <p className="text-xl font-bold">{summary.max}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Data Message */}
      {graphData.length === 0 && (
        <div className="text-center mt-4 p-4 bg-yellow-800 text-yellow-200 rounded">
          No data available for this time range.
        </div>
      )}
    </div>
  );
};

export default MultiSensorGraph;
