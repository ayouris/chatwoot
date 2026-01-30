TAG_VERSION = "v4.10.0"
IMAGE_NAME = "elbissat/chatwoot"

pipeline {
  agent { label 'linux' }

  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }

  environment {
    DOCKERHUB_CREDENTIALS = credentials('elbissat-dockerhub')
  }

  stages {
    stage('Login to Docker registry') {
      steps {
        sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
      }
    }

    stage('Docker Build and Push') {
      steps {
        sh "docker build -t ${IMAGE_NAME}:${TAG_VERSION} -f docker/Dockerfile --push ."
      }
    }

    stage('Deploy') {
      steps {
        sshagent(credentials: ['root-ssh-workerlabs']) {
          sh "ssh root@65.21.95.212 \"docker service update --image ${IMAGE_NAME}:${TAG_VERSION} --force messaging_chatwoot_web\""
          sh "ssh root@65.21.95.212 \"docker service update --image ${IMAGE_NAME}:${TAG_VERSION} --force messaging_chatwoot_worker\""
          sh 'ssh root@65.21.95.212 "sleep 10"'
          sh 'ssh root@65.21.95.212 "docker stack ps messaging --filter desired-state=running"'
        }
      }
    }
  }


}
