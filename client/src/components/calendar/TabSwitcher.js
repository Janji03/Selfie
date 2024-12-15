import React from "react";

const TabSwitcher = ({
  currentFormTab,
  setCurrentFormTab,
  disableEventTab,
  disableTaskTab,
}) => {
  return (
    <div className="tab-container">
      <button
        disabled={disableEventTab}
        className={currentFormTab === "event" ? "active" : ""}
        onClick={() => setCurrentFormTab("event")}
      >
        Event
      </button>
      <button
        disabled={disableTaskTab}
        className={currentFormTab === "task" ? "active" : ""}
        onClick={() => setCurrentFormTab("task")}
      >
        Task
      </button>
    </div>
  );
};

export default TabSwitcher;
