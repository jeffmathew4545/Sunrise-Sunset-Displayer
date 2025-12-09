# Sunrise-Sunset-Displayer
A webpage made using HTML,  Basic CSS, and Javascript to display the sunrise and sunset time of a particular city on some particular day.
Displays sunrise and sunset time in the local time for that particular city.
Uses three separate API's
The first is from API-Ninjas:- Geolocator api, to convert city and country inputs into lat and long values.
The second is from sunset-sunrise-api:- To get the sunrise and sunset time for lat, long, and date inputs. Time values are in UTC.
The third is from TimeZoneDB:- To get the GMT Offset of a particular lat, long input, which is added to UTC value to get time in local timezone
