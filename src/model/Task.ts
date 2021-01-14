interface File {
  id: number;

  url: string;
}

export default class Task {
  id: number;

  name: string;

  description: string;

  deliveryTime: string;

  files: Array<File>;

  constructor(
    id: number,
    name: string,
    description: string,
    deliveryTime: string,
    files: Array<File>
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.deliveryTime = deliveryTime;
    this.files = files;
  }

  getFiles(): Array<File> {
    return this.files;
  }
  
  hasFiles(): boolean {
    return this.files.length > 0;
  }
}
