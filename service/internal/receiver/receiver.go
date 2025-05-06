package receiver

import (
	"encoding/json"
	"fmt"
	log "github.com/sirupsen/logrus"
	"net/http"
	"os"
	"strings"
	"time"
)

type Webhook struct {
	Alerts []Alert
}

type Alert struct {
	Status      string
	Annotations map[string]string
	Labels      map[string]string
	Metadata    struct {
		AlertManagerUrl string
	}
}

var alertMap = make(map[string]*Alert)
var lastUpdated int64

func ReceiveWebhook(w http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)

	var webhook Webhook

	err := decoder.Decode(&webhook)

	if err != nil {
		log.Errorf("Decode err: %v", err)
	}

	log.Infof("Webhook: %+v", webhook)

	clear(alertMap)

	for k, _ := range webhook.Alerts {
		handleAlert(&webhook.Alerts[k])
	}

	lastUpdated = int64(time.Now().Unix())
}

func handleAlert(alert *Alert) {
	log.Infof("Alert: %+v", alert)

	alert.Metadata.AlertManagerUrl = buildURL(alert)

	alertMap[alert.Annotations["summary"]] = alert
}

func buildURL(alert *Alert) string {
	host := os.Getenv("ALERTMANAGER_HOST")

	if host == "" {
		return "#"
	}

	return fmt.Sprintf("%v/#/alerts?filter={%v}", host, buildURLFilter(alert))
}

func buildURLFilter(alert *Alert) string {
	v := ""

	filterKeys := []string{"job", "instance"}

	for i, k := range filterKeys {
		v += fmt.Sprintf("%v=\"%v\"", k, alert.Labels[k])
		v = strings.ReplaceAll(v, "=", "%3D")

		if i != len(filterKeys)-1 {
			v += "%2C "
		}
	}

	return v
}

func GetAllAlerts(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res := AlertListResponse{
		LastUpdated: lastUpdated,
		Alerts:      alertMap,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

type AlertListResponse struct {
	LastUpdated int64
	Alerts      map[string]*Alert
}
