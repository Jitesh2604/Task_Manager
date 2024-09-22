import React from 'react'
import TaskColumn from './TasksColumn'

export default function TasksContent({todo, inProgress, completed}) {
  return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To-Do Column */}
          <TaskColumn
            title={
              <>
                <span className="mr-2">🔘</span> To Do
              </>
            }
            tasks={todo}
            droppableId="To Do"
          />

          {/* In Progress Column */}
          <TaskColumn
            title={
              <>
                <span className="mr-2 text-blue-500">🔵</span> In Progress
              </>
            }
            tasks={inProgress}
            droppableId="In Progress"
          />

          {/* Completed Column */}
          <TaskColumn
            title={
              <>
                <span className="mr-2 text-green-500">✅</span> Completed
              </>
            }
            tasks={completed}
            droppableId="Completed"
          />
        </div>
  )
}
