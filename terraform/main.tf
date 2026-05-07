// S3 backend stores Terraform state remotely
terraform {
    backend "s3" {
        region = "us-east-1"
    }
}

// AWS provider with configurable region
provider "aws" {
    region = var.aws_region
}

resource "aws_s3_bucket" "test-bucket" {
    bucket = "rit-gender-revealed-test-bucket"
}