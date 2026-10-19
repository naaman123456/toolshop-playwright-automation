// Runs on Windows or Linux agents. The agent needs Node.js on the PATH.
// Plugins used: Pipeline, Git, JUnit, HTML Publisher.

def run(String cmd) {
    if (isUnix()) {
        sh cmd
    } else {
        bat cmd
    }
}

pipeline {
    agent any

    parameters {
        choice(
            name: 'TEST_SUITE',
            choices: ['api', 'ui', 'all'],
            description: 'api runs anywhere. ui needs a machine that Cloudflare does not block.'
        )
    }

    triggers {
        // Checks GitHub for new commits every 5 minutes
        pollSCM('H/5 * * * *')
    }

    options {
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Install dependencies') {
            steps {
                run 'node -v'
                run 'npm ci'
            }
        }

        stage('Install Playwright browsers') {
            steps {
                run 'npx playwright install chromium'
            }
        }

        stage('Run tests') {
            steps {
                script {
                    def paths = [api: 'tests/api', ui: 'tests/ui', all: '']
                    run "npx playwright test ${paths[params.TEST_SUITE]}"
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'junit-results/results.xml'
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            publishHTML(target: [
                reportName: 'Playwright Report',
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])
        }
    }
}
