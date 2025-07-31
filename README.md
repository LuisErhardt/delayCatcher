# delayCatcher

Dieses Projekt ermöglicht es, über die Deutsche Bahn API verspätete Züge an einem bestimmten Bahnhof abzurufen und diese im csv-Format abzuspeichern.

Inspiriert durch diesen [Reddit-Thread](https://www.reddit.com/r/deutschebahn/comments/1evid66/deutschlandticket_entsch%C3%A4digungen_beantragen/).

## Nutzung

Aktuell sind unter `/data` Verspätungsdaten für Köln Hbf gepspeichert. Lösche den Ordner, wenn du Daten für einen anderen Bahnhof speichern willst.

```
node main.js <stationCode> <path>
```

`<stationCode>` ist dabei die [Interne Bahnhofsnummer (IBNR)](https://de.wikipedia.org/wiki/Interne_Bahnhofsnummer), die jeden Bahnhof identifiziert. Der Code für Köln Hbf ist beispielsweise `8000207`.

`<path>` gibt das Verzeichnis an, unter dem die Daten gespeichert werden sollen. Default ist `""`.

Der Befehl ruft alle Verspätungen für den vorherigen Tag ab und fügt die Daten zu `<Jahr>/delays<Monatsnummer>.csv` hinzu, bzw. erstellt die Datei, falls diese noch nicht existiert.

Wenn eine gefundene Verspätung schon in der csv steht, dann wird sie nicht mehr hinzugefügt.

## License

This project is licensed under the [MIT License](LICENSE).
