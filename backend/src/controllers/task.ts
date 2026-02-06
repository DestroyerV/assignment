import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';
import { TaskValidationSchema } from '../utils/validation';

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = TaskValidationSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ errors: validation.error.format() });
      return;
    }

    const { title, description, status } = validation.data;
    const task = new Task({
      title,
      description,
      status: status || 'PENDING',
      user: req.user!.id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    let query: any = {};
    if (req.user!.role !== 'ADMIN') {
      query.user = req.user!.id;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const tasks = await Task.find(query).skip(skip).limit(limit).populate('user', 'name email');
    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validation = TaskValidationSchema.partial().safeParse(req.body);
    
    if (!validation.success) {
      res.status(400).json({ errors: validation.error.format() });
      return;
    }

    let task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (req.user!.role !== 'ADMIN' && task.user.toString() !== req.user!.id) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    task = await Task.findByIdAndUpdate(id, validation.data, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (req.user!.role !== 'ADMIN' && task.user.toString() !== req.user!.id) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
