module "payment-service" {
  source = "./modules/generic"

  project_name              = "payment-service"
  create_aws_ecr_repository = true
}
