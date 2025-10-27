pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_HUB_USERNAME = 'snowvita'
        FRONTEND_IMAGE = "${DOCKER_HUB_USERNAME}/elite-haven-frontend"
        BACKEND_IMAGE = "${DOCKER_HUB_USERNAME}/elite-haven-backend"
        EC2_HOST = credentials('ec2-host')
        SSH_KEY = credentials('ec2-ssh-key')
        VERSION = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('Backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('Frontend') {
                    sh 'npm ci --legacy-peer-deps'
                    sh 'npm run build -- --configuration production'
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                sh "docker build -t ${BACKEND_IMAGE}:${VERSION} -t ${BACKEND_IMAGE}:latest ./Backend"
                sh "docker build -t ${FRONTEND_IMAGE}:${VERSION} -t ${FRONTEND_IMAGE}:latest ./Frontend"
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                sh "echo ${DOCKER_HUB_CREDENTIALS_PSW} | docker login -u ${DOCKER_HUB_CREDENTIALS_USR} --password-stdin"
                sh "docker push ${BACKEND_IMAGE}:${VERSION}"
                sh "docker push ${BACKEND_IMAGE}:latest"
                sh "docker push ${FRONTEND_IMAGE}:${VERSION}"
                sh "docker push ${FRONTEND_IMAGE}:latest"
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                sh """
                    scp -i ${SSH_KEY} -o StrictHostKeyChecking=no docker-compose.prod.yml ubuntu@${EC2_HOST}:/home/ubuntu/
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                        cd /home/ubuntu
                        docker-compose -f docker-compose.prod.yml pull
                        docker-compose -f docker-compose.prod.yml down
                        docker-compose -f docker-compose.prod.yml up -d
                        docker image prune -f
                    '
                """
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
            cleanWs()
        }
    }
}
