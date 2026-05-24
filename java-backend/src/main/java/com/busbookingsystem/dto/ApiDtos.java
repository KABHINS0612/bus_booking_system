package com.busbookingsystem.dto;

import com.busbookingsystem.entity.Driver;
import com.busbookingsystem.entity.Trip;
import com.busbookingsystem.entity.Vehicle;

import java.util.List;

public final class ApiDtos {

    private ApiDtos() {
    }

    public record VehicleDto(Long id, String name, String model, Integer capacity) {
        public static VehicleDto from(Vehicle v) {
            return new VehicleDto(v.getId(), v.getName(), v.getModel(), v.getCapacity());
        }
    }

    public record DriverDto(Long id, String name, Integer experience) {
        public static DriverDto from(Driver d) {
            return new DriverDto(d.getId(), d.getName(), d.getExperience());
        }
    }

    public record TripDto(
            Long id,
            Long userId,
            String username,
            String contact,
            Long vehicleId,
            String vehicleName,
            Long driverId,
            String driverName,
            String startDate,
            String endDate,
            String pickupPoint,
            String endPoint,
            String status
    ) {
        public static TripDto from(Trip trip) {
            return new TripDto(
                    trip.getId(),
                    trip.getUser().getId(),
                    trip.getUser().getUsername(),
                    trip.getUser().getContact(),
                    trip.getVehicle().getId(),
                    trip.getVehicle().getName(),
                    trip.getDriver().getId(),
                    trip.getDriver().getName(),
                    trip.getStartDate(),
                    trip.getEndDate(),
                    trip.getPickupPoint(),
                    trip.getEndPoint(),
                    trip.getStatus()
            );
        }
    }

    public record BookTripRequest(
            Long vehicleId,
            Long driverId,
            String startDate,
            String endDate,
            String pickupPoint,
            String endPoint
    ) {
    }

    public record AddVehicleRequest(String name, String model, Integer capacity) {
    }

    public record AddDriverRequest(String name, Integer experience) {
    }
}
