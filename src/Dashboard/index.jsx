import { useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import data from '../Data/data.json';
import { ResponsiveContainer } from 'recharts';


const Dashboard = () => {

    useEffect(() => {
        document.body.classList.add('dark');
    }, []);
    // Process data to extract insights
    const processData = (data) => {
        const summaryByDate = {};
        const summaryBySeverity = {};
        const summaryByType = {};
        const summaryBySourceIp = {};
        const summaryByDestinationIp = {};


        data.forEach(item => {
            const date = item.timestamp.split('T');

            if (!summaryByDate[date]) {
                summaryByDate[date] = { date, alerts: 0 };
            }
            summaryByDate[date].alerts += 1;

            if (item.alert && item.alert.severity !== undefined) {
                if (!summaryBySeverity[item.alert.severity]) {
                    summaryBySeverity[item.alert.severity] = { severity: item.alert.severity, count: 0 };
                }
                summaryBySeverity[item.alert.severity].count += 1;
            }

            if (item.alert && item.alert.category !== undefined) {
                if (!summaryByType[item.alert.category]) {
                    summaryByType[item.alert.category] = { type: item.alert.category, count: 0 };
                }
                summaryByType[item.alert.category].count += 1;
            }

            if (!summaryBySourceIp[item.src_ip]) {
                summaryBySourceIp[item.src_ip] = { ip: item.src_ip, count: 0 };
            }
            summaryBySourceIp[item.src_ip].count += 1;

            if (!summaryByDestinationIp[item.dest_ip]) {
                summaryByDestinationIp[item.dest_ip] = { ip: item.dest_ip, count: 0 };
            }
            summaryByDestinationIp[item.dest_ip].count += 1;

        });

        return {
            alertsOverTime: Object.values(summaryByDate),
            alertsBySeverity: Object.values(summaryBySeverity),
            alertTypesDistribution: Object.values(summaryByType),
            sourceIpsWithMostAlerts: Object.values(summaryBySourceIp).sort((a, b) => b.count - a.count).slice(0, 10),
            destinationIpsWithMostAlerts: Object.values(summaryByDestinationIp).sort((a, b) => b.count - a.count).slice(0, 10),
        };
    };

    const {
        alertsOverTime,
        alertsBySeverity,
        alertTypesDistribution,
        sourceIpsWithMostAlerts,
        destinationIpsWithMostAlerts,
    } = processData(data);

    return (
        <div className="p-4 bg-gray-800 text-white min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl text-center w-full">Network Security Dashboard</h1>
            </div>


            <div className="w-full grow">

                {/* Alerts Over Time */}
                <div className="bg-gray-700 p-4 rounded grow mb-5">
                    <h2 className="text-xl mb-2">Alerts Over Time</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={alertsOverTime}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="alerts" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Source IPs with Most Alerts */}
                <div className="bg-gray-700 p-4 rounded grow mb-5">
                    <h2 className="text-xl mb-2">Source IPs with Most Alerts</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={sourceIpsWithMostAlerts}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ip" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Destination IPs with Most Alerts */}
                <div className="bg-gray-700 p-4 rounded grow mb-5">
                    <h2 className="text-xl mb-2">Destination IPs with Most Alerts</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={destinationIpsWithMostAlerts}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ip" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Alerts by Severity */}
                <div className="bg-gray-700 p-4 rounded grow mb-5">
                    <h2 className="text-xl mb-2">Alerts by Severity</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            width={500}
                            height={300}
                            data={alertsBySeverity}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="severity" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Alert Types Distribution */}
                <div className="bg-gray-700 p-4 rounded grow mb-5">
                    <h2 className="text-xl mb-2">Alert Types Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>

                        <PieChart
                        // width={500}
                        //  height={300}
                        >
                            <Pie
                                data={alertTypesDistribution}
                                dataKey="count"
                                nameKey="type"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                            >
                                {alertTypesDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#82ca9d' : '#8884d8'} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
