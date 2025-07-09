import room from "../model/room.model.js"


export const postRoom = async (req, res) => {
    const { fullName, city, rent, description, phone} = req.body;
    try {
        
        const roomPosting = await room.create({
            fullName,
            city,
            rent,
            description,
            phone
        })

        res.status(200).json({
            success: true,
            msg: "Successful"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const searchRoom = async (req, res) => {
    const  city  = req.body.city;

    try {
        if (!city) {
            return res.status(400).json({
                success: false,
                msg: "City is required"
            });
        }

        const details = await room.find({ city });

        if (details.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "There is no room available in this city"
            });
        }

        return res.status(200).json({
            success: true,
            details
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        });
    }
};
