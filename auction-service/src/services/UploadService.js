import AWS from 'aws-sdk';

class UploadService {
  constructor(bucketName) {
    this.s3 = new AWS.S3();
    this.bucketName = bucketName;
  }

  async upload(filename, content) {
    return this.s3.upload({
      Bucket: this.bucketName,
      Key: filename,
      Body: content,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    }).promise();
  }
}

export default UploadService;