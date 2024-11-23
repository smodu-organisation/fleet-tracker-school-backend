const { Subscription, Schools } = require('../models');

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      include: [{ model: Schools, attributes: ['id', 'school_name'] }],
    });
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubscriptionById = async (req, res) => {
  const { id } = req.params;

  try {
    const subscription = await Subscription.findByPk(id, {
      include: [{ model: Schools, attributes: ['id', 'school_name'] }],
    });

    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSubscription = async (req, res) => {
  const { school_id, payment_status, payment_method, next_billing_date } = req.body;

  try {
    const newSubscription = await Subscription.create({
      school_id,
      payment_status,
      payment_method,
      next_billing_date,
    });

    res.status(201).json(newSubscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { payment_status, payment_method, next_billing_date } = req.body;

  try {
    const [rowsUpdated] = await Subscription.update(
      { payment_status, payment_method, next_billing_date },
      { where: { id } }
    );

    if (!rowsUpdated) return res.status(404).json({ message: 'Subscription not found' });

    res.status(200).json({ message: 'Subscription updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSubscription = async (req, res) => {
  const { id } = req.params;

  try {
    const rowsDeleted = await Subscription.destroy({ where: { id } });

    if (!rowsDeleted) return res.status(404).json({ message: 'Subscription not found' });

    res.status(200).json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubscriptionBySchool = async (req, res) => {
  const { school_id } = req.params;

  try {
    const subscription = await Subscription.findOne({
      where: { school_id },
      include: [{ model: Schools, attributes: ['school_name'] }],
    });

    if (!subscription) return res.status(404).json({ message: 'Subscription not found for this school' });

    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptionBySchool,
};
