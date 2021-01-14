interface ITaskDTO {
  name: string;

  description: string;

  deliveryDate: string;

  files: [
    {
      url: string;
    }
  ];

  matterName: string;
}

export default ITaskDTO;
