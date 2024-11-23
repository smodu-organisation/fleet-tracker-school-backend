const { RouteStop, Route } = require('../models');

const getAllRouteStops = async (req, res) => {
  try {
    const stops = await RouteStop.findAll({ include: { model: Route, as: 'route' } });
    res.status(200).json(stops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStopsByRoute = async (req, res) => {
  const { route_id } = req.params;
  try {
    const stops = await RouteStop.findAll({ where: { route_id }, order: [['stop_order', 'ASC']] });
    if (!stops.length) return res.status(404).json({ message: 'No stops found for this route' });
    res.status(200).json(stops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRouteStop = async (req, res) => {
  const {
    route_id,
    stop_name,
    stop_latitude,
    stop_longitude,
    stop_order,
    stop_distance,
    stop_estimated_time,
    waiting_time,
    estimated_arrival_time,
  } = req.body;

  try {
    const newStop = await RouteStop.create({
      route_id,
      stop_name,
      stop_latitude,
      stop_longitude,
      stop_order,
      stop_distance,
      stop_estimated_time,
      waiting_time,
      estimated_arrival_time,
    });
    res.status(201).json(newStop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRouteStop = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const [rowsUpdated] = await RouteStop.update(updates, { where: { id } });
    if (!rowsUpdated) return res.status(404).json({ message: 'Stop not found' });
    res.status(200).json({ message: 'Stop updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRouteStop = async (req, res) => {
  const { id } = req.params;

  try {
    const rowsDeleted = await RouteStop.destroy({ where: { id } });
    if (!rowsDeleted) return res.status(404).json({ message: 'Stop not found' });
    res.status(200).json({ message: 'Stop deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStopOrder = async (req, res) => {
  const { route_id } = req.params;
  const { stopOrders } = req.body;

  try {
    await Promise.all(
      stopOrders.map(({ stop_id, stop_order }) =>
        RouteStop.update({ stop_order }, { where: { id: stop_id, route_id } })
      )
    );
    res.status(200).json({ message: 'Stop order updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateEstimatedTimes = async (req, res) => {
  const { route_id } = req.params;

  try {
    const stops = await RouteStop.findAll({
      where: { route_id },
      order: [['stop_order', 'ASC']],
    });

    if (!stops.length) return res.status(404).json({ message: 'No stops found for this route' });

    let cumulativeTime = 0;
    const updatedStops = await Promise.all(
      stops.map(async (stop) => {
        cumulativeTime += stop.stop_estimated_time + stop.waiting_time / 60; 
        const estimated_arrival_time = new Date();
        estimated_arrival_time.setHours(estimated_arrival_time.getHours() + cumulativeTime);
        await stop.update({ estimated_arrival_time });
        return stop;
      })
    );

    res.status(200).json(updatedStops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllRouteStops,
  getStopsByRoute,
  createRouteStop,
  updateRouteStop,
  deleteRouteStop,
  updateStopOrder,
  calculateEstimatedTimes,
};
