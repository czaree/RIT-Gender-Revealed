# RITGenderRevealed

## Set-up Guide
1. Before anything else, first create an S3 bucket to store the memory of the program (a .tfstatefile).
2. If you don't already have access keys set up for an IAM user or the root user of your AWS account, [create a new access key through the AWS console.](http://docs.aws.amazon.com/keyspaces/latest/devguide/create.keypair.html)
3. Then, fork this repo and add four items to the Github Secrets:
    - `TF_S3_BUCKET`: The name of the bucket created to store the .tfstate file in
    - `TF_STATE_KEY`: The name of the .tfstate file to be created (terraform.tfstate by default)
    - `AWS_ACCESS_KEY_ID`: The access key ID associated with your AWS account
    - `AWS_SECRET_ACCESS_KEY`: The secret access key associated with your AWS account
4. Run the `Terraform Init, Plan, and Apply` Github Action workflow to launch the program
