package com.busbookingsystem.service;

import com.busbookingsystem.entity.Vehicle;
import com.busbookingsystem.repository.VehicleRepository;
import com.busbookingsystem.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private TripRepository tripRepository;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> getVehicleById(Long vehicleId) {
        return vehicleRepository.findById(vehicleId);
    }

    public Vehicle addVehicle(String name, String model, Integer capacity) {
        Vehicle vehicle = new Vehicle();
        vehicle.setName(name);
        vehicle.setModel(model);
        vehicle.setCapacity(capacity);
        return vehicleRepository.save(vehicle);
    }

    public boolean deleteVehicle(Long vehicleId) {
        // Check if vehicle is used in any trip
        if (!tripRepository.findAll().stream()
                .anyMatch(trip -> trip.getVehicle() != null && trip.getVehicle().getId().equals(vehicleId))) {
            vehicleRepository.deleteById(vehicleId);
            return true;
        }
        return false;
    }

    public Vehicle updateVehicle(Long vehicleId, String name, String model, Integer capacity) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(vehicleId);
        if (vehicle.isPresent()) {
            Vehicle v = vehicle.get();
            v.setName(name);
            v.setModel(model);
            v.setCapacity(capacity);
            return vehicleRepository.save(v);
        }
        return null;
    }
}

