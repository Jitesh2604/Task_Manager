import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Card, CardContent } from '../ui/card';

const TaskColumn = ({ title, tasks=[], droppableId }) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          className="bg-gray-800 rounded-lg p-4"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            {title}
            <span className="ml-2 text-gray-500">({tasks.length})</span>
          </h2>
          <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          >
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <RenderTaskCard key={task._id} task={task} index={index} />
            ))
          ) : (
            <p className="text-gray-500">No tasks available</p>
          )}
          {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

const RenderTaskCard = ({ task, index }) => {
  return (
    <Draggable draggableId={task._id.toString()} index={index}>
      {(provided) => (
        <Card
          className="mb-4 bg-gray-700"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">{task.title}</h3>
            <p className="text-gray-400 mb-2">{task.description}</p>
            <p className="text-sm text-gray-500">Priority: {task.priority}</p>
            <p className="text-sm text-gray-500">Status: {task.status}</p>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskColumn;
