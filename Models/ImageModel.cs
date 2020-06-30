using Microsoft.Azure.Cosmos.Table;

namespace Survivor.Models
{
    public class ImageModel : TableEntity
    {
        public ImageModel(string userName, string name, string description)
        {
            this.UserName = userName;
            this.Name = name;
            this.Description = description;
        }

        public ImageModel()
        {

        }

        public string UserName
        {
            get { return this.PartitionKey; }
            set { this.PartitionKey = value; }
        }

        public string Id
        {
            get { return this.RowKey; }
            set { this.RowKey = value; }
        }

        public string Name { get; set; }

        public string Description { get; set; }

        public bool UploadComplete { get; set; }

        public Entities.V1U0.ImageEntity ToU0Entity()
        {
            return new Entities.V1U0.ImageEntity()
            {
                Id = this.Id,
                Name = this.Name,
            };
        }

        public Entities.V1U1.ImageEntity ToU1Entity()
        {
            return new Entities.V1U1.ImageEntity()
            {
                Id = this.Id,
                Name = this.Name,
                Description = this.Description
            };
        }
    }
}
