package repositories

import (
	"github.com/snehaamishraa/taskflow/backend/database"
	"github.com/snehaamishraa/taskflow/backend/models"
)

type TaskRepository struct{}

func NewTaskRepository() *TaskRepository {
	return &TaskRepository{}
}

func (r *TaskRepository) CreateTask(task *models.Task) error {
	return database.DB.Create(task).Error
}

func (r *TaskRepository) GetTasksByUserID(userID uint) ([]models.Task, error) {
	var tasks []models.Task

	err := database.DB.
		Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&tasks).Error

	return tasks, err
}

func (r *TaskRepository) SearchTasks(userID uint, search string) ([]models.Task, error) {
	var tasks []models.Task

	err := database.DB.
		Where("user_id = ? AND (LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))",
			userID,
			"%"+search+"%",
			"%"+search+"%",
		).
		Order("created_at desc").
		Find(&tasks).Error

	return tasks, err
}

func (r *TaskRepository) FilterTasks(userID uint, status string, priority string) ([]models.Task, error) {

	var tasks []models.Task

	query := database.DB.Where("user_id = ?", userID)

	if status != "" {
		query = query.Where("status = ?", status)
	}

	if priority != "" {
		query = query.Where("priority = ?", priority)
	}

	err := query.Order("created_at desc").Find(&tasks).Error

	return tasks, err
}

func (r *TaskRepository) GetDashboardStats(userID uint) (map[string]int64, error) {

	stats := make(map[string]int64)

	var total int64
	var pending int64
	var completed int64
	var inProgress int64

	database.DB.Model(&models.Task{}).Where("user_id = ?", userID).Count(&total)

	database.DB.Model(&models.Task{}).
		Where("user_id = ? AND status = ?", userID, "Pending").
		Count(&pending)

	database.DB.Model(&models.Task{}).
		Where("user_id = ? AND status = ?", userID, "Completed").
		Count(&completed)

	database.DB.Model(&models.Task{}).
		Where("user_id = ? AND status = ?", userID, "In Progress").
		Count(&inProgress)

	stats["total"] = total
	stats["pending"] = pending
	stats["completed"] = completed
	stats["in_progress"] = inProgress

	return stats, nil
}

func (r *TaskRepository) GetTaskByID(taskID uint) (*models.Task, error) {

	var task models.Task

	err := database.DB.First(&task, taskID).Error

	if err != nil {
		return nil, err
	}

	return &task, nil
}

func (r *TaskRepository) UpdateTask(task *models.Task) error {
	return database.DB.Save(task).Error
}

func (r *TaskRepository) DeleteTask(task *models.Task) error {
	return database.DB.Delete(task).Error
}