import { React, useState, useEffect } from "react";
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

import { useAuth } from "@clerk/clerk-react";

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
  const [userData, setUserData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [communityStats, setCommunityStats] = useState(null);
  const [userLanguages, setUserLanguages] = useState(null);
  const [weeklyGraphData, setWeeklyGraphData] = useState(null);
  const [graphData, setGraphData] = useState(null);

  const { userId } = useAuth();

  const getPercentage = (value, total) => {
    return ((value / total) * 100).toFixed(2);
  };

  const formatDateToYYYYMMDD = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}/${month}/${day}`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user1 = await fetch(`http://127.0.0.1:3456/api/users/${userId}`);

      const result = await user1.json();

      setUserData(result);
    };

    const fetchStreakData = async () => {
      const streak = await fetch(
        `http://127.0.0.1:3456/api/users/streaks/${userId}`
      );

      const result = await streak.json();

      setStreakData(result);
    };

    const fetchPlotData = async () => {
      const graphData = await fetch(
        `http://127.0.0.1:3456/api/users/graphData/${userId}`
      );

      const result = await graphData.json();

      let formattedLanguages = {};

      let totalLang = 0;

      for (let language of result["languages"]) {
        totalLang += Number(language["count"]);
      }

      for (let language of result["languages"]) {
        formattedLanguages[language["language"]] = getPercentage(
          language["count"],
          totalLang
        );
      }

      setGraphData(result["contributions"]);
      setUserLanguages(formattedLanguages);
    };

    const fetchContributions = async () => {
      const dateTo = formatDateToYYYYMMDD(new Date().toISOString());
      const dateFrom = formatDateToYYYYMMDD(
        new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
      );

      console.log(dateFrom, dateTo);

      const response = await fetch(
        `http://127.0.0.1:3456/api/users/contributionsByDate/${userId}?dateFrom=${dateFrom}&dateTo=${dateTo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      setWeeklyGraphData(result);
    };

    const fetchCommunityStats = async () => {
      const response = await fetch(
        `http://127.0.0.1:3456/api/users/community/${userId}`
      );

      const result = await response.json();

      setCommunityStats(result);
    };

    fetchUserData();
    fetchStreakData();
    fetchPlotData();
    fetchContributions();
    fetchCommunityStats();
  }, []);

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
    labels: userLanguages ? Object.keys(userLanguages) : {},
    datasets: [
      {
        label: "Languages Contributed",
        data: userLanguages ? Object.values(userLanguages) : {},
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

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const weeklyData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: "Weekly Contributions",
        data: daysOfWeek.map((day) =>
          weeklyGraphData && weeklyGraphData[day]
            ? weeklyGraphData[day].private + weeklyGraphData[day].public
            : 0
        ),
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
          <h2>{userData ? userData.name : "__"}</h2>
          <p>{userData ? userData.email : "__"}</p>
          <p>{userData ? userData.bio : "__"}</p>
          <p>{userData ? userData.location : "__"}</p>
        </div>
        <div className="user-links">
          <a
            href={userData ? userData.githubLink : "__"}
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
          <a
            href={userData ? userData.linkedinLink : "__"}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a
            href={userData ? userData.twitterLink : "__"}
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </a>
        </div>

        <div className="community-stats">
          <h3>Community Stats</h3>
          <div className="stats">
            <p>
              Contributions:{" "}
              {communityStats ? communityStats.contributions : "__"}
            </p>
            <p>Threads: {communityStats ? communityStats.threads : "__"}</p>
            <p>
              Reputations: {communityStats ? communityStats.reputations : "__"}
            </p>
          </div>
        </div>
      </div>
      <div className="profile-stats">
        <div className="contribution-box-container">
          <div className="contribution-box">
            <div className="contribution-card total-contribution">
              <h1>{streakData ? streakData.total_contributions : "__"}</h1>
              <h3>Total Contributions</h3>
              <h3>
                {streakData
                  ? new Date(
                      streakData.highest_streak_from
                    ).toLocaleDateString()
                  : "__"}{" "}
                - Present
              </h3>
            </div>
            <div className="contribution-card current-streak">
              <h1>{streakData ? streakData.current_streak : "__"}</h1>
              <h3>Current Streak</h3>
              <h3>
                {streakData
                  ? new Date(
                      streakData.current_streak_from
                    ).toLocaleDateString()
                  : "__"}{" "}
                -{" "}
                {streakData
                  ? new Date(streakData.current_streak_to).toLocaleDateString()
                  : "__"}
              </h3>
            </div>
            <div className="contribution-card max-streak">
              <h1>{streakData ? streakData.highest_streak : "__"}</h1>
              <h3>Highest Streak</h3>
              <h3>
                {streakData
                  ? new Date(
                      streakData.highest_streak_from
                    ).toLocaleDateString()
                  : "__"}{" "}
                -{" "}
                {streakData
                  ? new Date(streakData.highest_streak_to).toLocaleDateString()
                  : "__"}
              </h3>
            </div>
          </div>
        </div>

        <div className="weekly-plots">
          <div className="weekly-plot">
            <h5>Weekly Contributions</h5>
            {weeklyGraphData ? <Bar data={weeklyData} /> : <p>Loading...</p>}
          </div>
          <div className="yearly-piechart">
            <h5>Languages Contributed</h5>
            {userLanguages ? (
              <Pie data={pieData} options={pieOptions} />
            ) : (
              <p>Loading...</p>
            )}
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
