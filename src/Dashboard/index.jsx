import { useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import data from '../Data/data.json';

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
        const summaryByAction = {};

        data.forEach(item => {
            const date = item.timestamp.split('T')[0];

            if (!summaryByDate[date]) {
                summaryByDate[date] = { date, alerts: 0 };
            }
            summaryByDate[date].alerts += 1;

            if (!summaryBySeverity[item.severity]) {
                summaryBySeverity[item.severity] = { severity: item.severity, count: 0 };
            }
            summaryBySeverity[item.severity].count += 1;

            if (!summaryByType[item.alert_type]) {
                summaryByType[item.alert_type] = { type: item.alert_type, count: 0 };
            }
            summaryByType[item.alert_type].count += 1;

            if (!summaryBySourceIp[item.source_ip]) {
                summaryBySourceIp[item.source_ip] = { ip: item.source_ip, count: 0 };
            }
            summaryBySourceIp[item.source_ip].count += 1;

            if (!summaryByDestinationIp[item.destination_ip]) {
                summaryByDestinationIp[item.destination_ip] = { ip: item.destination_ip, count: 0 };
            }
            summaryByDestinationIp[item.destination_ip].count += 1;

            if (!summaryByAction[item.action]) {
                summaryByAction[item.action] = { action: item.action, count: 0 };
            }
            summaryByAction[item.action].count += 1;
        });

        return {
            alertsOverTime: Object.values(summaryByDate),
            alertsBySeverity: Object.values(summaryBySeverity),
            alertTypesDistribution: Object.values(summaryByType),
            sourceIpsWithMostAlerts: Object.values(summaryBySourceIp).sort((a, b) => b.count - a.count).slice(0, 10),
            destinationIpsWithMostAlerts: Object.values(summaryByDestinationIp).sort((a, b) => b.count - a.count).slice(0, 10),
            alertsByAction: Object.values(summaryByAction),
        };
    };

    const {
        alertsOverTime,
        alertsBySeverity,
        alertTypesDistribution,
        sourceIpsWithMostAlerts,
        destinationIpsWithMostAlerts,
        alertsByAction
    } = processData(data);

    return (
        <div className="p-4 bg-gray-800 text-white min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl">Network Security Dashboard</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded">
                    <h2 className="text-xl mb-2">Alerts Over Time</h2>
                    <LineChart
                        width={500}
                        height={300}
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
                </div>
                <div className="bg-gray-700 p-4 rounded">
                    <h2 className="text-xl mb-2">Alerts by Severity</h2>
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
                </div>
                <div className="bg-gray-700 p-4 rounded">
                    <h2 className="text-xl mb-2">Alert Types Distribution</h2>
                    <PieChart width={500} height={300}>
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
                </div>
                <div className="bg-gray-700 p-4 rounded">
                    <h2 className="text-xl mb-2">Source IPs with Most Alerts</h2>
                    <BarChart
                        width={500}
                        height={300}
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
                </div>
                <div className="bg-gray-700 p-4 rounded">
                    <h2 className="text-xl mb-2">Destination IPs with Most Alerts</h2>
                    <BarChart
                        width={500}
                        height={300}
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
                </div>
                <div className="bg-gray-700 p-4 rounded">
                    <h2 className="text-xl mb-2">Alerts by Action</h2>
                    <PieChart width={500} height={300}>
                        <Pie
                            data={alertsByAction}
                            dataKey="count"
                            nameKey="action"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                        >
                            {alertsByAction.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#82ca9d' : '#8884d8'} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
