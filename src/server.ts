import { config } from 'dotenv';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid'; // TODO: add uuid's to the models
import { Sequelize } from 'sequelize-typescript';
import Rec from './models/Rec';
import {ValidationError} from "sequelize";
import Member from "./models/Member";
import MeterPoint from "./models/MeterPoint";
import Measurement from "./models/Measurement";

// dotenv
config();

const dbFile = process.env.DB_FILE || 'db.sqlite';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbFile,
    //models: [__dirname + '/models/*.ts']
    models: [Rec, Member, MeterPoint, Measurement]
});
// creates tables / migrates to new schema if changed
sequelize.sync({alter: true});

const port = parseInt(process.env.PORT || '8001', 10);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());

app.post('/rec', async (req, res) => {
    const { name, metadata, gridSegment, publicKey } = req.body;
    try {
        const newRec: Rec = new Rec({name, metadata, gridSegment, publicKey});
        const ret = await newRec.save();
        console.log(`created new Rec: ${JSON.stringify(newRec)}`);
        res.status(200).send();
    } catch(e) {
        console.log(`creating rec failed: ${e}`);
        if(e instanceof ValidationError) {
            if(e.name === "SequelizeUniqueConstraintError") {
                // ...
            }
        }
        res.status(400).send(e);
    }
});

app.get('/recs', async (req, res) => {
    const recs = await Rec.findAll();
    res.json(recs);
});

app.get('/recs/:recId/members', async (req, res) => {
    const recId = req.params.recId;
    console.log(`requested all members for rec ${recId}`);
    const members = await Member.findAll({
        where: {
            recId
        }
    });
    res.json(members);
});

app.post('/member', async (req, res) => {
    const { metadata, gridSegment, publicKey, recId } = req.body;
    try {
        const newMember: Member = new Member({metadata, gridSegment, publicKey, recId});
        const ret = await newMember.save();
        console.log(`created new Member: ${newMember.toString()}`);
        res.status(200).send();
    } catch(e) {
        console.log(`creating member failed: ${e}`);
        res.status(400).send(e);
    }
});

app.post('/recs/:recId/member', async (req, res) => {
    const recId = req.params.recId;
    const { metadata, gridSegment, publicKey } = req.body;
    try {
        const newMember: Member = new Member({metadata, gridSegment, publicKey, recId});
        const ret = await newMember.save();
        console.log(`created new Member: ${newMember.toString()} for REC ${recId}`);
        res.status(200).send();
    } catch(e) {
        console.log(`creating member failed: ${e}`);
        res.status(400).send(e);
    }
});

app.get('/unassigned-members', async (req, res) => {
    console.log('requested all members not assigned to a rec');
    const members = await Member.findAll({
        where: {
            recId: null
        }
    });
    res.json(members);
});

// TODO: remove
app.get('/members', async (req, res) => {
    const members = await Member.findAll();
    res.json(members);
});

app.get('/recs/:recId/members', async (req, res) => {
    const recId = req.params.recId;
    console.log(`requested all members for rec ${recId}`);
    const members = await Member.findAll({
        where: {
            recId
        }
    });
    res.json(members);
});


app.post('/members/:memberId/meterpoint', async (req, res) => {
    const memberId = req.params.memberId;
    const { metadata, publicKey, mqttTopic } = req.body;
    try {
        const newMeterPoint: MeterPoint = new MeterPoint({metadata, publicKey, memberId, mqttTopic});
        const ret = await newMeterPoint.save();
        console.log(`created new MeterPoint: ${newMeterPoint.toString()} for member ${memberId}`);
        res.status(200).send();
    } catch(e) {
        console.log(`creating meter point failed: ${e}`);
        res.status(400).send(e);
    }
});

app.get('/members/:memberId/meterpoints', async (req, res) => {
    const memberId = req.params.memberId;
    console.log(`requested all meterpoints for member ${memberId}`);
    const meterpoints = await MeterPoint.findAll({
        where: {
            memberId
        }
    });
    res.json(meterpoints);
});

// TODO: restrict access in prod - may become too expensive in big RECs and be abused for DoS
app.get('/meterpoints', async (req, res) => {
    const meterpoints = await MeterPoint.findAll();
    res.json(meterpoints);
});


app.post('/meterpoints/:meterpointId/measurement', async (req, res) => {
    const meterPointId = req.params.meterpointId;
    const { value, signature, timestamp } = req.body;
    try {
        const newMeasurement: Measurement = new Measurement({value, signature, timestamp, meterPointId});
        const ret = await newMeasurement.save();
        console.log(`created new measurement: ${newMeasurement.toString()} for member ${meterPointId}`);
        res.status(200).send();
    } catch(e) {
        console.log(`creating measurement failed: ${e}`);
        res.status(400).send(e);
    }
});

app.post('/measurement-by-topic', async (req, res) => {
    const { mqttTopic, value, timestamp } = req.body;
    try {
        const meterPoint = await MeterPoint.findOne({where: {
                mqttTopic
            }
        });

        if (meterPoint === undefined) {
            console.log('meterpoint not found');
            throw new Error(`no meterpoint found for topic ${mqttTopic}`);
        }

        const meterPointId = meterPoint?.id;

        const newMeasurement: Measurement = new Measurement({value, timestamp, meterPointId});
        const ret = await newMeasurement.save();
        console.log(`created new measurement: ${newMeasurement.toString()} for member ${meterPointId}`);
        res.status(200).send();
    } catch(e) {
        console.log(`creating measurement failed: ${e}`);
        res.status(400).send(e);
    }
});

// TODO: add pagination
app.get('/meterpoints/:meterpointId/measurements', async (req, res) => {
    const meterPointId = req.params.meterpointId;
    console.log(`requested all measurements for meterpoint ${meterPointId}`);
    const measurements = await Measurement.findAll({
        where: {
            meterPointId
        }
    });
    res.json(measurements);
});

// TODO: remove
app.get('/measurements', async (req, res) => {
    const measurements = await Measurement.findAll();
    res.json(measurements);
});


app.listen(port, 'localhost', () => {
    console.log(`App listening at http://localhost:${port}`);
});
