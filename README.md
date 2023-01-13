# traffic-gen
a small script written with node js net module to generate random traffic between multiple devices.

```
{
    "ServerPort" : 6969,
    "ServerAddress" : "0.0.0.0",
    "ClientRetryInterval" : 30, // default is 30 minutes
    "TransmissionsTimeRange" : [45,90], // specifies how much time each data transfer should take (minutes) , a random number is going to be chosen in the given range
    "TransmissionsSizeRange" : [128,192], // specifies the size of data sent each time (megabytes) , a random number is going to be chosen in the given range
    "TransmissionsGapTimeRange" : [120,180], // specifies how much time it should wait for the next transfer , a random number is going to be chosen in the given range
    "IPs":[
        "127.0.0.1"
    ] // list of other devices to connect to
}
```
