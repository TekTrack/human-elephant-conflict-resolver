package com.example.jumbowatch.model;

public class ZoneCorners {

    private String zoneName;
    private double corners[][]; //for A,B,C,D corners of the zone

    public ZoneCorners(String name, double[] a, double[] b, double[] c, double[] d) {
        this.zoneName = name;
        this.corners = new double[][]{a, b, c, d};
    }

    public String getZoneName() {
        return zoneName;
    }

    public double[][] getCorners() {
        return corners;
    }

}
