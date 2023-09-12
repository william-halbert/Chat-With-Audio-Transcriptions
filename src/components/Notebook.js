import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Configuration, OpenAIApi } from "openai";

export default function Notebook() {
  const location = useLocation();
  //const { affirmation } = location.state;

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function openaiRequest(chunk) {
      const configuration = new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_KEY,
      });
      const openai = new OpenAIApi(configuration);

      let conversationToOpenai = [
        {
          role: "user",
          content: `
                Summarize everything into bullet points. Don't leave out information.

                Class Transcript: ${chunk}`,
        },
      ];

      try {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo-16k",
          messages: conversationToOpenai,
          temperature: 0.5,
          max_tokens: 600, // We want around 600 words
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        });

        return response.data.choices[0].message.content.split("\n"); // Split the response into bullet points
      } catch (e) {
        console.log("Error:", e.message, e);
        if (e.response) {
          console.log("Server Response:", e.response.data.error.message);
        }
      }
    }

    async function processTranscript() {
      if (!affirmation) return;

      // Split the affirmation into chunks of approximately 1000 words
      const chunks = affirmation
        .split(/\s+/)
        .reduce((acc, word, idx) => {
          const chunkIndex = Math.floor(idx / 1000);
          if (!acc[chunkIndex]) {
            acc[chunkIndex] = [];
          }
          acc[chunkIndex].push(word);
          return acc;
        }, [])
        .map((chunk) => chunk.join(" "));

      const allNotes = [];
      for (const chunk of chunks) {
        const chunkNotes = await openaiRequest(chunk);
        allNotes.push(...chunkNotes);
      }

      setNotes(allNotes);
    }

    processTranscript();
  }, [affirmation]);

  return (
    <div style={{ margin: "36px 110px" }}>
      {notes.map((note, idx) => (
        <p key={idx}>{note}</p>
      ))}
    </div>
  );
}
const affirmation = `Diagram Representation of Chemical Processes Sindia M. Rivera-Jiménez, Ph.D. Department of Engineering Education Dmitry I. Kopelevich, Ph. D. Department of Chemical Engineering ECH 4604: Process Economics and Optimization Unit 1: Process Design: Conceptualization and Analysis Objectives 2 1 2 3 At the end of this class you will be able to: Importance of Flowsheets Part 1 3 Chemical processes have… Substances High chemical reactivity High toxicity High corrosivity Extreme Conditions High T High P 4 @ What potential consequences we could have if we have error or omissions in communication? Consequences of Miscommunication Explosions Environmental damage Threats to people’s health 5 Solution: Formulate appropriate process diagrams Be skilled in analyzing Interpreting diagrams prepared by others >2 year Life of a chemical plant… 6 $$$$$ spent with no revenue 0 year 5 year Plant must produce profit to pay: Plant operations Repay debt for designing and building the plant Optimization Flowsheets Used in the life of a project because many unforeseen changes are highly to occur along the plant life 7 What changes may occur in a life of chemical plant? Potential Changes During Plant Lifetime 8 Quality of raw materials may change Product specifications raised Production rates may increase Equipment performance decreases because of wear Development of a new catalyst Cost of utilities may change New environmental regulations are introduced New improved equipment may appear on the market Importance of Flowsheets 9 Design and plant layout Used by specialists design groups as the basis for their design (ME, EE, Civil) Training and manuals for plant operators/interns/new engineers Used in plant start-up and operation as a basis of comparison of operating performance with design Used to later revamp the plant Flowsheets keep a plant profitable Tracking and documenting changes in operating conditions Diagnose operating problems Troubleshoot Debottleneck systems for increased capacity Predict effect of making changes in operating conditions 10 Types of Flowsheets Part 2 11 Types of Flowsheets 12 Block Flow Diagram (BFD) Process Flow Diagram (PFD) Piping and Instrumentation Diagram (P&ID) Block Flow Diagram (BFD) 13 Rough idea of the process flow structure Each block represents a function May consist of several pieces of equipment Useful for giving a presentation Fig. 1.1 of Turton et al. + H 2 → + CH 4 Characteristics of BFD Operations shown by blocks. Major flow lines shown with arrows giving direction of flow. Flow goes from left to right whenever possible (recycles go right to left) Light streams (gases) toward top Heavy streams (liquids & solids) toward bottom If lines cross, then the horizontal line is continuous and the vertical line is broken. Simplified material balance provided. 14 Fig. 1.1 of Turton et al. + H 2 → + CH 4 Process Flow Diagram (PFD) 15 Includes all process vessels, equipment and utility flow lines In a table: Full heat and material balance showing: X i , T, P Fig. 1.3 of Turton et al. Characteristics of a PFD Shows all the major pieces of equipment in the process along with a description of the equipment, a unique equipment number, a descriptive name. Shows all process flow streams + unique stream numbers Shows all utility streams supplied to major equipment Shows basic control loops 16 Pumps, Turbines, Compressors Symbols for Drawing PFD Fig. 1.4 of Turton et al. Heat Exchangers Fired Heater Storage Tanks Symbols for Drawing PFD (cont’d) Fig. 1.4 of Turton et al. Towers Reactors Vessels 19 Conventions for Process Equipment Designation Examples: R-101 V-102 P-102A/B C-102A/B 20 Conventions for Process Streams All conventions for BFD still apply Diamond symbol located in flow lines Numerical identification (unique for that stream) inserted in diamond Flow direction shown by arrows on flow lines 21 Conventions for Utility Streams More info in Table 1.3 Question: Why use steam at different pressures? lps Low-Pressure Steam: 3–5 barg (sat) mps Medium-Pressure Steam: 10–15 barg (sat) hps High-Pressure Steam: 40–50 barg (sat) htm Heat Transfer Media (Organic): T up to 400 o C cw Cooling water: from cooling tower: in T in ≈ 30 o C, out T out < 45 o C rw Refrigerated water: in T in ≈ 5 o C, T out < 15 o C rb Refrigerate brine: in T in ≈ -4 5 o C, T out < 0 o C bfw Boiler feed water ng Natural gas fg Fuel gas Identify Process Equipment 22 Fig. 1.3 of Turton et al. Block Flow Diagram (BFD) 23 Blocks from BFD 24 Fig. 1.3 of Turton et al. Flow Summary 25 Information Provided in a Flow Summary Required Info Stream Number Temperature (°C) Pressure (bar) Vapor Fraction Total Mass Flowrate (kg/h) Total Mole Flowrate ( kmol /h) Individual Component Flowrates ( kmol /h) Optional Component Mole Fractions Component Mass Fractions Individual Component Flowrates (kg/h) Volumetric Flowrates (m 3 /h) Significant Physical Properties Density Viscosity Other Thermodynamic Data Heat Capacity Stream Enthalpy K-values Stream Name 26 Example: Obtain Toluene Conversion Rate 27 Fig. 1.3 of Turton et al. Example: Obtain Toluene Conversion Rate 28 Fig. 1.3 of Turton et al.       With the table you should be able to do an overall mass balance 29 Equipment Description in PFDs Towers Size (height & diameter) Pressure, temperature Number and type of trays Height and type of packing Materials of construction Heat Exchangers Type: gas-gas, gas-liquid, liquid-liquid, condenser, vaporizer Process: duty, area, temperature, and pressure for both streams Number of shell and tube passes Materials of construction (tubes & shell) Tanks and Vessels Size (height & diameter) Orientation Pressure, temperature Materials of construction Pumps Flow rate Discharge pressure Δ P Temperature Drive type Shaft power Materials of construction 30 31 Example of Equipment Description Information Flags A way to add stream info to the diagram Info is useful for plant construction Useful in the analysis of operating problems during the life of the plant Flags are physically mounted on a staff and connected to appropriate streams Only most important flags are added to PDF to avoid clutter 32 Fig. 1.6 of Turton et al. PFD with Flags and Control Loops 33 Fig. 1.5 of Turton et al. 34 PFD in Control Systems Example: Distillation System in Unit Ops Lab Piping and Instrumentation Diagram (P&ID) 35 M ore detailed than a PFD I ncludes: A ncillary instruments/valves Sampling and draining lines S tart-up and shut down systems P ipe sizes 36 Example: P&ID for Distillation Column to Separate Benzene and Toluene Fig. 1.7 of Turton et al. What is NOT included in P&ID Operating conditions T, P Stream flows Equipment locations Pipe routing Pipe length Pipe fittings Supports, structures, and foundations 37 What is included For equipment: show every piece including Spare units Parallel units Summary details of each unit For piping: include all lines including drains and sample connections, and specify Size (use standard sizes) Schedule (thickness) Materials of construction Insulation (thickness and type) For Instruments: Indicators Recorders Controllers Instrument Lines For Utilities: Entrance utilities Exit utilities Exit to waste treatment facilities 38 P&ID Uses Last stage of the design process and is used for: Mechanical engineers and civil engineers: design and install pieces of equipment. Instrument engineers: specify, install, and check control systems. Piping engineers: develop plant layout and elevation drawings. Project engineers: develop plant and construction schedules. 39 40 https://www.youtube.com/watch?v=1N5HQIs-5-o https://www.youtube.com/watch?v=FxcAnth7J-g 3D Models 41 https://www.youtube.com/watch?v=I3ELnek14LI Process Animation Virtual Reality and Process Animation Virtual Reality Training for Operators https://www.youtube.com/watch?v=KYK6wuFaES8 24 1 33 We will continue using this process (hydrodealkylation of toluene to produce benzene) throughout the class 13 19 20 21 36 40 41 We will continue using this process (hydrodealkylation of toluene to produce benzene) throughout the class 23 25 22 26 27 28 29 31`;
