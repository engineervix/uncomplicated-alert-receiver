'use strict'

window.severityWeighting = new Map();

export default function main () {
  window.baseUrl = window.location.origin

  if (window.baseUrl.includes('localhost')) {
    window.baseUrl = 'http://localhost:8082'
  }

  window.timeUntilNextUpdate = 0

  window.intervalTimer = setInterval(updateProgressBar, 1000)

  updateSettings()
}

function updateSettings () {
  window.fetch(window.baseUrl + '/settings')
    .then(response => response.json())
    .then(res => {
      window.settings = res
      window.severityWeighting = new Map(Object.entries(res.SeverityLabels))
      document.getElementById('current-version').innerHTML = 'Version: ' + res.Version
    })
    .catch(error => {
      console.error('Fetch error:', error)
      document.getElementById('current-version').innerHTML = 'Error fetching version'
    })
}
function updateProgressBar () {
  const progressBar = document.getElementById('next-update')

  progressBar.value = 30 - window.timeUntilNextUpdate

  window.timeUntilNextUpdate--

  if (window.timeUntilNextUpdate < 0) {
    fetchAlertList()
    window.timeUntilNextUpdate = 30
  }
}

function fetchAlertList () {
  const alertList = document.getElementById('alert-list')
  alertList.innerHTML = ''

  window.fetch(window.baseUrl + '/alert_list')
    .then(response => response.json())
    .then(res => {
      const alerts = res.Alerts

      for (const alert of Object.keys(alerts)) {
        alertList.appendChild(renderAlert(alerts[alert]))
      }

      renderLastUpdated(res)
    }).catch(error => {
      console.error('Fetch error:', error)

      document.getElementById('last-updated').textContent = 'Fetch error'
      document.getElementById('last-updated').classList.add('critical')
    })
}

function renderLastUpdated (res) {
  if (res.LastUpdated > 0) {
    const lastUpdatedDate = new Date(res.LastUpdated * 1000)
    const deltaLastUpdated = Math.floor((lastUpdatedDate - new Date()) / 1000)
    const formatter = new Intl.RelativeTimeFormat()

    document.getElementById('last-updated').textContent = formatter.format(deltaLastUpdated, 'seconds')
    document.getElementById('last-updated').title = 'Last payload from AlertManager: ' + lastUpdatedDate.toLocaleString()

    if (deltaLastUpdated < -100) {
      document.getElementById('last-updated').classList.add('critical')
    } else if (deltaLastUpdated > 0) {
      document.getElementById('last-updated').classList.add('info')
    } else {
      document.getElementById('last-updated').classList.remove('critical')
    }
  } else if (res.LastUpdated === 0) {
    document.getElementById('last-updated').textContent = 'Nothing received from Alertmanager yet'
    document.getElementById('last-updated').classList.add('critical')
  }
}

function renderAlert (alert) {
  const linkElement = document.createElement('a')
  linkElement.href = alert.Metadata.AlertManagerUrl
  linkElement.target = '_blank'
  linkElement.textContent = alert.Annotations.summary

  const alertElement = document.createElement('div')
  alertElement.classList.add('alert')
  alertElement.appendChild(linkElement)

  if ('severity' in alert.Labels) {
    if (severityWeighting.has(alert.Labels.severity)) {
      alertElement.classList.add('sev' + severityWeighting.get(alert.Labels.severity))
    } else {
      alertElement.style.order = '10'
    }
  } else {
    alertElement.style.order = '10'
  }

  if (window.settings.DrawLabels) {
    for (const label of Object.keys(alert.Labels)) {
      if (window.settings.IgnoredLabels.includes(label)) {
        continue
      }

      const labelElement = document.createElement('span')
      labelElement.classList.add('label')

      const keyElement = document.createElement('span')
      keyElement.classList.add('key')
      keyElement.textContent = label
      labelElement.appendChild(keyElement)

      const valElement = document.createElement('span')
      valElement.classList.add('val')
      valElement.textContent = alert.Labels[label]
      labelElement.appendChild(valElement)

      alertElement.appendChild(labelElement)
    }
  }

  return alertElement
}
