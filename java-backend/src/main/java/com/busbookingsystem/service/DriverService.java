package com.busbookingsystem.service;

import com.busbookingsystem.entity.Driver;
import com.busbookingsystem.repository.DriverRepository;
import com.busbookingsystem.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private TripRepository tripRepository;

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Optional<Driver> getDriverById(Long driverId) {
        return driverRepository.findById(driverId);
    }

    public Driver addDriver(String name, Integer experience) {
        Driver driver = new Driver();
        driver.setName(name);
        driver.setExperience(experience);
        return driverRepository.save(driver);
    }

    public boolean deleteDriver(Long driverId) {
        // Check if driver is assigned to any trip
        if (!tripRepository.findAll().stream()
                .anyMatch(trip -> trip.getDriver() != null && trip.getDriver().getId().equals(driverId))) {
            driverRepository.deleteById(driverId);
            return true;
        }
        return false;
    }

    public Driver updateDriver(Long driverId, String name, Integer experience) {
        Optional<Driver> driver = driverRepository.findById(driverId);
        if (driver.isPresent()) {
            Driver d = driver.get();
            d.setName(name);
            d.setExperience(experience);
            return driverRepository.save(d);
        }
        return null;
    }
}

