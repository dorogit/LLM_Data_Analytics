import React, { useState, useMemo } from 'react';
import csvData from '../data/data.csv'; // Import the CSV data as a string

const parseCSV = (csvString) => {
  const rows = csvString.trim().split('\n');
  const headers = rows[0].split(',');
  const data = rows.slice(1).map((row) => {
    const values = row.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {});
  });
  return data;
};

const Home = () => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [tableData, setTableData] = useState(parseCSV(csvData));

  const sortData = (column) => {
    const sorted = [...tableData].sort((a, b) => {
      if (a[column] < b[column]) return sortOrder === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setTableData(sorted);
    setSortColumn(column);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const totalJobs = useMemo(() => {
    const groupedByYear = tableData.reduce((acc, curr) => {
      const year = curr.work_year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(curr);
      return acc;
    }, {});

    return Object.entries(groupedByYear).map(([year, jobs]) => ({
      year,
      totalJobs: jobs.length,
    }));
  }, [tableData]);

  const averageSalary = useMemo(() => {
    const groupedByYear = tableData.reduce((acc, curr) => {
      const year = curr.work_year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(curr.salary_in_usd);
      return acc;
    }, {});

    return Object.entries(groupedByYear).map(([year, salaries]) => ({
      year,
      averageSalary: salaries.reduce((a, b) => a + b, 0) / salaries.length,
    }));
  }, [tableData]);

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => sortData('work_year')}>Year</th>
          <th onClick={() => sortData('totalJobs')}>Number of Total Jobs</th>
          <th onClick={() => sortData('averageSalary')}>Average Salary in USD</th>
        </tr>
      </thead>
      <tbody>
        {totalJobs.map((row, index) => (
          <tr key={index}>
            <td>{row.year}</td>
            <td>{row.totalJobs}</td>
            <td>{averageSalary[index].averageSalary.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Home;