
################################################
#
#            AWS ECR REPOSITORY
#
################################################

module "aws_ecr_repository" {
  source = "git::https://github.com/team-tech-challenge/terraform-modules-remotes.git//aws_ecr_repository?ref=main"

  ecr_repository_name  = var.project_name
  image_tag_mutability = "MUTABLE"
  scan_on_push         = true
  ecr_tags = merge(
    {
      "Name" = var.project_name
    },
    var.ecr_tags
  )
  create_ecr_repository = var.create_aws_ecr_repository
}

################################################
#
#            AWS ECR POLICY
#
################################################

module "aws_ecr_repository_policy" {
  source = "git::https://github.com/team-tech-challenge/terraform-modules-remotes.git//aws_ecr_lifecycle_policy?ref=main"

  ecr_repository_name_policy      = module.aws_ecr_repository.ecr_repository_name
  create_ecr_lifecycle_repository = var.create_aws_ecr_repository

  depends_on = [
    module.aws_ecr_repository
  ]
}

################################################
#
#            ARGOCD APPLICATION
#
################################################

resource "kubectl_manifest" "argocd_application" {
  yaml_body = file("${path.root}./iac/app/applications.yaml")
}

################################################
#                                              #
#              SECRETS MANAGER                 #
#                                              #
################################################

module "aws_secrets_manager" {
	source        = "git::https://github.com/team-tech-challenge/terraform-modules-remotes.git//aws_secret_manager?ref=main"
	secret_name   = "${var.project_name}-secret-manager"
	create_secret = var.create_aws_ecr_repository

	tags = {
		Name = "${var.project_name}-secret-manager"
	}
}

