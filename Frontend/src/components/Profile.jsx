import React from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import "./profile/style.css";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  ArcElement
);

const Profile = () => {
  const user = {
    name: "John Doe",
    email: "abcd@gmail.com",
    bio: "I am a software engineer",
    location: "India",
    github: "https://github.com/abcd",
    linkedin: "https://linkedin.com/abcd",
    twitter: "https://twitter.com/abcd",
    communityStats: {
      contributions: 15,
      threads: 40,
      reputations: 50,
      highestStreak: 8,
      currentStreak: 5,
    },
    languages: {
      JavaScript: 40,
      Python: 30,
      Java: 15,
      CSharp: 10,
      Other: 5,
    },
  };

  const monthlyOptions = {
    aspectRatio: 2.8,
  };

  const monthlyData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Monthly Contributions",
        data: [12, 19, 3, 5, 2, 3, 7],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          font: {
            size: 10,
          },
          color: "white",
        },
      },
      tooltip: {
        callbacks: {
          labelTextColor: () => "white",
        },
      },
    },
  };

  const pieData = {
    labels: Object.keys(user.languages),
    datasets: [
      {
        label: "Languages Contributed",
        data: Object.values(user.languages),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const weeklyData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Weekly Contributions",
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="profile-container">
      <div className="user-info">
        <div className="user-details">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.bio}</p>
          <p>{user.location}</p>
        </div>
        <div className="user-links">
          <a href={user.github} target="_blank" rel="noreferrer">
            Github
          </a>
          <a href={user.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={user.twitter} target="_blank" rel="noreferrer">
            Twitter
          </a>
        </div>

        <div className="community-stats">
          <h3>Community Stats</h3>
          <div className="stats">
            <p>Contributions: {user.communityStats.contributions}</p>
            <p>Threads: {user.communityStats.threads}</p>
            <p>Reputations: {user.communityStats.reputations}</p>
          </div>
        </div>
      </div>
      <div className="profile-stats">
        <div className="contribution-box-container">
          <div className="contribution-box">
            <div className="contribution-card total-contribution">
              <h1>{user.communityStats.contributions}</h1>
              <h3>Total Contributions</h3>
              <h3>Jul 1, 2021 - Present</h3>
            </div>
            <div className="contribution-card current-streak">
              <h1>{user.communityStats.currentStreak}</h1>
              <h3>Current Streak</h3>
              <h3>Jul 1, 2021 - Present</h3>
            </div>
            <div className="contribution-card max-streak">
              <h1>{user.communityStats.highestStreak}</h1>
              <h3>Highest Streak</h3>
              <h3>Jul 8, 2021 - Present</h3>
            </div>
          </div>
        </div>

        <div className="weekly-plots">
          <div className="weekly-plot">
            <h5>Weekly Contributions</h5>
            <Bar data={weeklyData} />
          </div>
          <div className="yearly-piechart">
            <h5>Languages Contributed This Year</h5>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        <div className="contribution-plots">
          <div className="monthly-plot">
            <h3>Monthly Contributions</h3>
            <Line data={monthlyData} options={monthlyOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
