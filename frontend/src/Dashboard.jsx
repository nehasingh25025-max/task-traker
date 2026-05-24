import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  CalendarDays,
  FileText,
  LogOut,
  Bell,
  Mail,
  Search,
  Plus,
  Shield,
  Play,
  ClipboardCheck,
  CircleCheckBig,
} from "lucide-react";

const Dashboard = () => {

  // =====================================
  // USER DATA
  // =====================================

  const storedUser =
    JSON.parse(localStorage.getItem("tasktrack_active_user")) || {};
    const user = JSON.parse(localStorage.getItem("user"));

  const currentUser = {
    name: storedUser.name || "Unknown User",
    email: storedUser.email || "unknown@email.com",
    role: storedUser.role || "tasker",
  };

  // =====================================
  // STATES
  // =====================================

  const [activePage, setActivePage] = useState("dashboard");

  const [isPunchedIn, setIsPunchedIn] = useState(false);

  const [activeTaskId, setActiveTaskId] = useState(null);

  const [taskTimers, setTaskTimers] = useState({});

  const [allUsers, setAllUsers] = useState([]);

  const [seconds, setSeconds] = useState(0);

  const [showTaskForm, setShowTaskForm] = useState(false);

  const [taskForm, setTaskForm] = useState({
    taskNumber: "",
    title: "",
    prompt: "",
    description: "",
  });

  const [leaveForm, setLeaveForm] = useState({
  title: "",
  reason: "",
});

const [leaveRequests, setLeaveRequests] = useState([]);



const [taskTimer, setTaskTimer] = useState(0);

const [tasks, setTasks] = useState([
  {
    id: 1,
    taskNumber: "ETH-001",
    title: "Text to Image Compare",
    prompt: "Generate astronaut cat image",
    description: "Compare generated image with prompt accuracy",
    qc: "PASSED",
    submitted: true,
    timeTaken: "00:12:21",
  },

  {
    id: 2,
    taskNumber: "ETH-002",
    title: "Video Color Picker",
    prompt: "Detect color tones in video",
    description: "Review cinematic grading",
    qc: "PENDING",
    submitted: false,
    timeTaken: "00:04:10",
  },
]);
  // =====================================
  // TIMER
  // =====================================
useEffect(() => {

  let interval = null;

  if (activeTaskId && isPunchedIn) {

    interval = setInterval(() => {

      setTaskTimer((prev) => prev + 1);

    }, 1000);

  }

  return () => clearInterval(interval);

}, [activeTaskId, isPunchedIn]);

useEffect(() => {

  let interval = null;

  if (isPunchedIn) {

    interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

  }

  return () => clearInterval(interval);

}, [isPunchedIn]);

useEffect(() => {

  fetch("https://task-manager-app-production-8089.up.railway.app/api/auth/users")
  .then((res) => res.json())
  .then((data) => setAllUsers(data))
  .catch((err) => console.log(err));

  let taskInterval = null;

  if (activeTaskId && isPunchedIn) {

    taskInterval = setInterval(() => {

      setTaskTimers((prev) => ({
        ...prev,
        [activeTaskId]: (prev[activeTaskId] || 0) + 1,
      }));

    }, 1000);

  }

  return () => clearInterval(taskInterval);

  }, [isPunchedIn]);
const formatTaskTimer = (secs) => {

  const hours = Math.floor(secs / 3600);

  const minutes = Math.floor((secs % 3600) / 60);

  const seconds = secs % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

};
 const formattedTime = useMemo(() => {

  const safeSeconds = seconds || 0;

  const hrs = String(
    Math.floor(safeSeconds / 3600)
  ).padStart(2, "0");

  const mins = String(
    Math.floor((safeSeconds % 3600) / 60)
  ).padStart(2, "0");

  const secs = String(
    safeSeconds % 60
  ).padStart(2, "0");

  return `${hrs}:${mins}:${secs}`;

}, [seconds]);

  // =====================================
  // SIDEBAR
  // =====================================

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: "admin",
      label: "Admin Panel",
      icon: <Shield size={18} />,
    },
    {
      id: "tasks",
      label: "My Tasks",
      icon: <CheckSquare size={18} />,
    },
    {
      id: "projects",
      label: "My Projects",
      icon: <FolderKanban size={18} />,
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: <CalendarDays size={18} />,
    },
    {
      id: "leave",
      label: "Apply Leave",
      icon: <FileText size={18} />,
      
    },
    {
    id: "admin",
    label: "Admin Panel",
    icon: <Shield size={18} />,
    },

  ];

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // =====================================
  // TASK CREATE
  // =====================================

  const handleTaskChange = (e) => {
    setTaskForm({
      ...taskForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateTask = () => {

    if (
      !taskForm.taskNumber ||
      !taskForm.title ||
      !taskForm.prompt ||
      !taskForm.description
    ) {
      alert("Please fill all task fields");
      return;
    }

    const newTask = {
      id: Date.now(),
      taskNumber: taskForm.taskNumber,
      title: taskForm.title,
      prompt: taskForm.prompt,
      description: taskForm.description,
      status: "IN PROGRESS",
      project: "Ethara AI",
      date: new Date().toLocaleDateString(),
      qc: "PENDING",
      submitted: false,
    };

    setTasks([newTask, ...tasks]);

    setTaskForm({
      taskNumber: "",
      title: "",
      prompt: "",
      description: "",
    });

    setShowTaskForm(false);

    alert("Task Started Successfully");
  };

  // =====================================
  // SUBMIT TASK
  // =====================================

  const handleStartTask = (id) => {

  if (!isPunchedIn) {
    alert("Please Punch In First");
    return;
  }

  setActiveTaskId(id);

  alert("Task Started");
};

const handleStopTask = () => {
  setActiveTaskId(null);
};

const handleSubmitTask = (id) => {

    const updatedTasks = tasks.map((task) => {

      if (task.id === id) {
        return {
          ...task,
          submitted: true,
          status: "SUBMITTED",
          qc: "UNDER QC",
        };
      }

      return task;
    });

    setTasks(updatedTasks);

    alert("Task Submitted For QC");
  };

  // =====================================
  // COMPLETE TASK
  // =====================================

  const handleLeaveSubmit = () => {

  if (!leaveForm.title || !leaveForm.reason) {
    alert("Please fill all fields");
    return;
  }

  const newLeave = {
    id: Date.now(),
    title: leaveForm.title,
    reason: leaveForm.reason,
    status: "PENDING",
  };

  setLeaveRequests([newLeave, ...leaveRequests]);

  setLeaveForm({
    title: "",
    reason: "",
  });

  alert("Leave Request Submitted Successfully");
};

const handleCompleteTask = (id) => {

    const updatedTasks = tasks.map((task) => {

      if (task.id === id) {
        return {
          ...task,
          status: "COMPLETED",
          qc: "PASSED",
        };
      }

      return task;
    });

    setTasks(updatedTasks);

    alert("Task Completed Successfully");
  };

  // =====================================
  // DASHBOARD PAGE
  // =====================================

  const renderDashboard = () => (

    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-white">
          My Dashboard
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Welcome back, {currentUser.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        <div className="bg-[#101826] border border-[#1f2a3d] rounded-2xl p-5 col-span-2">

          <p className="text-xs text-gray-400 uppercase tracking-wider">
            SESSION TIMER
          </p>

          <h1 className="text-5xl font-bold text-white mt-3">
            {formattedTime}
          </h1>

          <div className="mt-6 flex gap-5">

            <button
              onClick={() => setIsPunchedIn(true)}
              className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-xl font-semibold"
            >
              Punch In
            </button>

            <button
              onClick={() => setIsPunchedIn(false)}
              className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-semibold"
            >
              Punch Out
            </button>

          </div>

        </div>

        <div className="bg-[#101826] border border-[#1f2a3d] rounded-2xl p-5">

          <p className="text-gray-400 text-sm">
            Total Tasks
          </p>

          <h1 className="text-5xl font-bold text-white mt-3">
            {tasks.length}
          </h1>

        </div>

        <div className="bg-[#101826] border border-[#1f2a3d] rounded-2xl p-5">

          <p className="text-gray-400 text-sm">
            Current Role
          </p>

          <h1 className="text-3xl font-bold text-cyan-400 mt-3 capitalize">
            {currentUser.role}
          </h1>

        </div>

      </div>

      <div className="bg-[#101826] border border-[#1f2a3d] rounded-2xl p-5">

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-white text-xl font-semibold">
            Start New Task
          </h2>

          <button

 onClick={() => {

  if (!isPunchedIn) {
    alert("Please Punch In First");
    return;
  }

  setShowTaskForm(true);

}}

  className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold"
>
  + Start Task
</button>

        </div>

        {showTaskForm && (

  <div className="space-y-4">

    <div className="bg-[#0f1725] border border-[#1f2a3d] rounded-2xl p-5">

      <p className="text-gray-400 text-sm">
        Current Task Timer
      </p>

      <h1 className="text-5xl font-bold text-cyan-400 mt-3">
        {formatTaskTimer(taskTimer)}
      </h1>

      <p className="text-gray-500 text-sm mt-2">
        Timer runs only after Punch In
      </p>

    </div>

    <select
  name="taskNumber"
  value={taskForm.taskNumber}
  onChange={handleTaskChange}
  className="w-full bg-[#0f1725] border border-[#1f2a3d] rounded-2xl p-5 text-white outline-none"
>

  <option value="">
    Select Task ID
  </option>

  <option value="TXT-101">
    TXT-101 — Text To Image Compare
  </option>

  <option value="VID-202">
    VID-202 — Video Color Picker
  </option>

  <option value="OBJ-303">
    OBJ-303 — Image Object Picker
  </option>

  <option value="UD-404">
    UD-404 — UD Perception Labels
  </option>

  <option value="QA-505">
    QA-505 — AI Response Ranking
  </option>

</select>

<button
  onClick={() => {

    if (!taskForm.taskNumber) {
      alert("Please Select Task ID");
      return;
    }

    setTaskTimer(0);

    setActiveTaskId(taskForm.taskNumber);

  }}
  className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold"
>
  Start Actual Task
</button>
            <input
              type="text"
              name="title"
              value={taskForm.title}
              onChange={handleTaskChange}
              placeholder="Task Title"
              className="w-full bg-[#0f1725] border border-[#1f2a3d] rounded-xl p-4 text-white outline-none"
            />

            <textarea
              name="prompt"
              value={taskForm.prompt}
              onChange={handleTaskChange}
              placeholder="Task Prompt"
              className="w-full bg-[#0f1725] border border-[#1f2a3d] rounded-xl p-4 text-white outline-none min-h-[120px]"
            />

            <textarea
              name="description"
              value={taskForm.description}
              onChange={handleTaskChange}
              placeholder="Task Description"
              className="w-full bg-[#0f1725] border border-[#1f2a3d] rounded-xl p-4 text-white outline-none min-h-[120px]"
            />
            <div className="bg-[#0f1725] border border-[#1f2a3d] rounded-2xl p-6 mt-6">

  <p className="text-gray-400 text-sm mb-2">
    Current Task Status
  </p>

  <h2 className="text-3xl font-bold text-cyan-400">
    {activeTaskId ? "TASK RUNNING" : "NO ACTIVE TASK"}
  </h2>

  <div className="mt-4">

    <p className="text-gray-400 text-sm">
      Task Timer
    </p>

    <h1 className="text-5xl font-bold text-cyan-400 mt-2">
      {formatTaskTimer(taskTimer)}
    </h1>

  </div>

  <div className="flex gap-4 mt-6 flex-wrap">

    <button
      onClick={() => {

        if (!isPunchedIn) {
          alert("Please Punch In First");
          return;
        }

        if (!taskForm.taskNumber) {
          alert("Please Select Task ID");
          return;
        }

        setActiveTaskId(taskForm.taskNumber);
      }}
      className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold"
    >
      Start Task
    </button>

    <button
      onClick={() => {

        if (!taskForm.prompt || !taskForm.description) {
          alert("Prompt & Description Required");
          return;
        }

        const grammarErrors = [];

        if (taskForm.description.length < 20) {
          grammarErrors.push("Description too short");
        }

        if (!taskForm.description.includes(".")) {
          grammarErrors.push("Add proper sentence punctuation");
        }

        if (grammarErrors.length > 0) {

          alert(
            "QC FAILED:\n\n" +
            grammarErrors.join("\n")
          );

          return;
        }

        alert("QC PASSED ✅");

      }}
      className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl font-semibold"
    >
      Submit To QC
    </button>

    <button
      onClick={() => {

        if (!activeTaskId) {
          alert("No Active Task");
          return;
        }

        const completedTask = {
          ...taskForm,
          qc: "PASSED",
          timeTaken: formatTaskTimer(taskTimer),
          submitted: true,
        };

        setTasks((prev) => [completedTask, ...prev]);

        alert("Task Submitted Successfully ✅");

        setTaskTimer(0);

        setActiveTaskId(null);

        setTaskForm({
          taskNumber: "",
          title: "",
          prompt: "",
          description: "",
        });

      }}
      className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold"
    >
      Final Submit
    </button>

  </div>

</div>

           <button

  onClick={() => {

    if (!isPunchedIn) {
      alert("Please Punch In First");
      return;
    }

    alert("Task Submitted Successfully");

  }}

  className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold"
>
  Submit Task
</button>

          </div>

        )}

      </div>

    </div>
  );

  // =====================================
  // TASKS PAGE
  // =====================================

  const renderTasks = () => (

    <div>

      <div className="flex items-center justify-between mb-6">

        <h1 className="text-2xl font-bold text-white">
          My Tasks
        </h1>

        <div className="flex gap-3">

          <input
            placeholder="Search tasks..."
            className="bg-[#101826] border border-[#1f2a3d] rounded-xl px-4 py-2 text-sm outline-none text-white"
          />

        </div>

      </div>

      <div className="space-y-4">

  <div className="bg-[#0f1725] border border-[#1f2a3d] rounded-2xl p-5">

    <p className="text-gray-400 text-sm">
      Current Task Timer
    </p>

    <h1 className="text-5xl font-bold text-cyan-400 mt-3">
      {formattedTime}
    </h1>

    <p className="text-gray-500 text-sm mt-2">
      Timer runs only after Punch In
    </p>

  </div>

        {tasks.map((task) => (

          <div
            key={task.id}
            className="bg-[#101826] border border-[#1f2a3d] rounded-2xl p-5"
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-white text-lg font-semibold">
                  {task.title}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Task Number: {task.taskNumber}
                </p>

              </div>

              <span className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm">
                {task.status}
              </span>

            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <p className="text-gray-400 text-sm mb-2">
                  Prompt
                </p>

                <div className="bg-[#0f1725] rounded-xl p-4 text-gray-300 text-sm">
                  {task.prompt}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">
                  Description
                </p>

                <div className="bg-[#0f1725] rounded-xl p-4 text-gray-300 text-sm">
                  {task.description}
                </div>
              </div>

            </div>

            <div className="bg-[#0f1725] border border-[#1f2a3d] rounded-2xl p-5 mb-5">

  <p className="text-gray-400 text-sm">
    Task Completion Timer
  </p>

  <h2 className="text-4xl font-bold text-cyan-400 mt-2">
    {formatTaskTimer(taskTimers[task.id])}
  </h2>

</div>

<div className="flex flex-wrap gap-4 mt-6">

              <button
  onClick={() => handleStartTask(task.id)}
  className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
>
  <Play size={18} />
  Start Task
</button>

<button
  onClick={handleStopTask}
  className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-semibold"
>
  Stop Task
</button>

<button
  onClick={() => handleSubmitTask(task.id)}
                className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
              >
                <ClipboardCheck size={18} />
                Submit QC
              </button>

              <button
                onClick={() => handleCompleteTask(task.id)}
                className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
              >
                <CircleCheckBig size={18} />
                Complete Task
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );

  const renderProjects = () => (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        Projects
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {[
  "Text To Image Compare",
  "Video Color Picker",
  "UD Perception Labels",
  "Image Object Picker",
  "AI Response Ranking",
  "Audio QA Review",
].map((project, i) => (
          <div
            key={i}
            className="bg-[#101826] border border-[#1f2a3d] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                LIVE
              </span>

              <FolderKanban size={18} className="text-cyan-400" />
            </div>

            <h2 className="text-white font-semibold text-lg mt-5">
              {project}
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Platform: MultiImage
            </p>

          </div>
        ))}

      </div>

    </div>
  );

  const renderAttendance = () => (
    <div>

      <h1 className="text-2xl font-bold text-white mb-6">
        Attendance
      </h1>

      <div className="bg-[#101826] border border-[#1f2a3d] rounded-2xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#0f1725]">
            <tr className="text-left text-gray-400 text-sm">
              <th className="p-4">Name</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Hours</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-[#1f2a3d]">
              <td className="p-4 text-white">
                {currentUser.name}
              </td>

              <td className="p-4 text-gray-300">
                {new Date().toLocaleDateString()}
              </td>

              <td className="p-4 text-green-400">
                PRESENT
              </td>

              <td className="p-4 text-white">
                {formattedTime}
              </td>
            </tr>
          </tbody>

        </table>

      </div>

    </div>
  );

  const renderLeavePage = () => (

  <div>

    <h1 className="text-3xl font-bold text-white mb-6">
      Apply Leave
    </h1>

    <div className="bg-[#101826] border border-[#1f2a3d] rounded-3xl p-8 max-w-4xl shadow-2xl">

      {!isPunchedIn && (

  <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 rounded-2xl p-5 mb-6">

    You are currently in VIEW MODE.  
    Punch In to start tasks, timers and submissions.

  </div>

)}

<div className="space-y-6">

        <div>

          <label className="text-gray-400 text-sm">
            Leave Title
          </label>

          <input
            type="text"
            value={leaveForm.title}
            onChange={(e) =>
              setLeaveForm({
                ...leaveForm,
                title: e.target.value,
              })
            }
            placeholder="Sick Leave"
            className="w-full mt-2 bg-[#0f1725] border border-[#1f2a3d] rounded-2xl p-5 text-white outline-none"
          />

        </div>

        <div>

          <label className="text-gray-400 text-sm">
            Leave Reason
          </label>

          <textarea
            value={leaveForm.reason}
            onChange={(e) =>
              setLeaveForm({
                ...leaveForm,
                reason: e.target.value,
              })
            }
            placeholder="Enter your reason..."
            className="w-full mt-2 bg-[#0f1725] border border-[#1f2a3d] rounded-2xl p-5 text-white outline-none min-h-[180px]"
          />

        </div>

        <button
          onClick={handleLeaveSubmit}
          className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-2xl font-semibold text-lg"
        >
          Submit Leave Request
        </button>

      </div>

      <div className="mt-10">

        <h2 className="text-xl font-bold text-white mb-5">
          Leave History
        </h2>

        <div className="space-y-4">

  <div className="bg-[#0f1725] border border-[#1f2a3d] rounded-2xl p-5">

    <p className="text-gray-400 text-sm">
      Current Task Timer
    </p>

    <h1 className="text-5xl font-bold text-cyan-400 mt-3">
      {formattedTime}
    </h1>

    <p className="text-gray-500 text-sm mt-2">
      Timer runs only after Punch In
    </p>

  </div>

          {leaveRequests.map((leave) => (

            <div
              key={leave.id}
              className="bg-[#0f1725] border border-[#1f2a3d] rounded-2xl p-5"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-white font-semibold text-lg">
                    {leave.title}
                  </h3>

                  <p className="text-gray-400 text-sm mt-1">
                    {leave.reason}
                  </p>

                </div>

                <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm">
                  {leave.status}
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  </div>
);

const renderAdminPanel = () => {
  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold text-cyan-400 mb-6">
        Admin Panel
      </h1>

      <div className="bg-[#0f1725] border border-[#1f2a3d] rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">
          All Registered Users
        </h2>

        {allUsers?.map((u, index) => (
          <div
            key={index}
            className="border border-[#1f2a3d] rounded-xl p-4 mb-4"
          >
            <p>
              <span className="text-cyan-400">Name:</span> {u.name}
            </p>

            <p>
              <span className="text-cyan-400">Email:</span> {u.email}
            </p>

            <p>
              <span className="text-cyan-400">Role:</span> {u.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

  return (

    <div className="bg-[#081120] min-h-screen flex">

      <aside className="w-[260px] bg-[#0b1422] border-r border-[#1c2940] flex flex-col">

        <div className="p-6 border-b border-[#1c2940]">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
              <Shield className="text-black" size={20} />
            </div>

            <div>
              <h1 className="text-white font-bold">
                Task Track
              </h1>

              <p className="text-xs text-gray-500">
                Ethara AI
              </p>
            </div>

          </div>

        </div>

        <div className="p-5">

          <div className="bg-[#101826] border border-[#1f2a3d] rounded-2xl p-4">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold">
                {currentUser.name?.charAt(0)}
              </div>

              <div>
                <h3 className="text-white font-medium">
                  {currentUser.name}
                </h3>

                <p className="text-xs text-gray-400 capitalize">
                  {currentUser.role}
                </p>
              </div>

            </div>

          </div>

        </div>

        <div className="px-4 flex-1">

          <div className="space-y-2">

            {sidebarItems.map((item) => (
              
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm ${
                  activePage === item.id
                    ? "bg-cyan-500 text-black font-semibold"
                    : "text-gray-300 hover:bg-[#101826]"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

          </div>

        </div>

        <div className="p-4 border-t border-[#1c2940]">

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#1f2a3d] text-gray-300 hover:bg-red-500 hover:border-red-500 hover:text-white transition"
          >
            <LogOut size={18} />
            Sign Out
          </button>

        </div>

      </aside>

      <div className="flex-1">

        <div className="h-[80px] border-b border-[#1c2940] px-8 flex items-center justify-between">

          <div className="flex items-center bg-[#101826] border border-[#1f2a3d] rounded-xl px-4 py-3 w-[380px]">
            <Search size={18} className="text-gray-500" />

            <input
              placeholder="Search..."
              className="bg-transparent ml-3 outline-none text-sm text-white w-full"
            />
          </div>

          <div className="flex items-center gap-6">

            <Bell className="text-gray-400" size={20} />
            <Mail className="text-gray-400" size={20} />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold">
                {currentUser.name?.charAt(0)}
              </div>

              <div>
                <h3 className="text-sm font-medium text-white">
                  {currentUser.name}
                </h3>

                <p className="text-xs text-gray-400 capitalize">
                  {currentUser.role}
                </p>
              </div>
            </div>

          </div>

        </div>

        <div className="p-8">

          {activePage === "dashboard" && renderDashboard()}
          {user?.role === "admin" && activePage === "admin" && renderAdminPanel()}
          {activePage === "tasks" && renderTasks()}
          {activePage === "admin" && renderAdminPanel()}
          {activePage === "projects" && renderProjects()}
          {activePage === "attendance" && renderAttendance()}
          {activePage === "leave" && renderLeavePage()}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;