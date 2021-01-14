import MatterController from "../controller/MatterController";
import Task from "./Task";

export default class Matter {

    name: string;

    teacher: string;

    tasks: Array<Task>;

    private pastTasks: Array<Task>;

    private notPastTasks: Array<Task>;

    constructor(name: string, teacher: string, tasks: Array<Task>) {
        this.name = name;
        this.teacher = teacher;
        this.tasks = tasks;

        this.pastTasks = this.tasks.filter(task => MatterController.past(task));
        this.notPastTasks = this.tasks.filter(task => !MatterController.past(task));
    }

    hasPastTasks(): boolean {
        return this.pastTasks.length > 0;
    }

    hasNotPastTasks(): boolean {
        return this.notPastTasks.length > 0;
    }

    getTasks(): Task[] {
        return this.tasks;
    }

    getPastTasks(): Task[] {
        return this.pastTasks;
    }

    getNotPastTasks(): Task[] {
        return this.notPastTasks;
    }
}