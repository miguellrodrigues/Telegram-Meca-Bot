import Matter from "../model/Matter";
import api from "../services/Api";

const load = async (matters: Array<Matter>, mattersNames: Array<string>) => {
  await api.get("/matters").then((response) => {
    const data = response.data as Array<{}>;

    data.map((data) => {
      const matter = data as Matter;
      
      matters.push(new Matter(matter.name, matter.teacher, matter.tasks));
      mattersNames.push(matter.name.toLowerCase());
    });
  });
}

const remainingTime = async (id: number): Promise<string> => {
  let time;

  await api.get(`/tasks/remainingTime/${id}`).then((response) => {
    const { remainingTime } = response.data;

    time = remainingTime;
  });

  return String(time);
}

export { load, remainingTime };