package services

import (
	"errors"

	"github.com/snehaamishraa/taskflow/backend/models"
	"github.com/snehaamishraa/taskflow/backend/repositories"
)

type TaskService struct {
	repo *repositories.TaskRepository
}

func (s *TaskService) DeleteTask(userID uint, taskID uint) error {

	task, err := s.repo.GetTaskByID(taskID)

	if err != nil {
		return err
	}

	if task.UserID != userID {
		return errors.New("unauthorized")
	}

	return s.repo.DeleteTask(task)
}

func NewTaskService() *TaskService {
	return &TaskService{
		repo: repositories.NewTaskRepository(),
	}
}

func (s *TaskService) CreateTask(userID uint, req models.CreateTaskRequest) (*models.Task, error) {

	task := &models.Task{
		Title:       req.Title,
		Description: req.Description,
		Priority:    req.Priority,
		DueDate:     req.DueDate,
		Status:      "Pending",
		UserID:      userID,
	}

	err := s.repo.CreateTask(task)

	if err != nil {
		return nil, err
	}

	return task, nil
}

func (s *TaskService) GetTasks(userID uint) ([]models.Task, error) {
	return s.repo.GetTasksByUserID(userID)
}

func (s *TaskService) UpdateTask(userID uint, taskID uint, req models.UpdateTaskRequest) (*models.Task, error) {

	task, err := s.repo.GetTaskByID(taskID)

	if err != nil {
		return nil, err
	}

	if task.UserID != userID {
		return nil, errors.New("unauthorized")
	}

	task.Title = req.Title
	task.Description = req.Description
	task.Status = req.Status
	task.Priority = req.Priority
	task.DueDate = req.DueDate

	err = s.repo.UpdateTask(task)

	if err != nil {
		return nil, err
	}

	return task, nil
}

func (s *TaskService) SearchTasks(userID uint, search string) ([]models.Task, error) {
	return s.repo.SearchTasks(userID, search)
}

func (s *TaskService) FilterTasks(userID uint, status string, priority string) ([]models.Task, error) {
	return s.repo.FilterTasks(userID, status, priority)
}

func (s *TaskService) DashboardStats(userID uint) (map[string]int64, error) {
	return s.repo.GetDashboardStats(userID)
}
