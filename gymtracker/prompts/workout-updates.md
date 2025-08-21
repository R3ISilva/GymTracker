# Task Context
Lets change workout page

# Task
- Lets move workout saving and reading logic to a seperate file in index.tsx and share it with workout.tsx
- Lets change so that when we click push/legs/pull it shows a list of panes with the following structure:
- Lets always keep the bottom navbar visible

<NExercise>
    </Gif>
    </Reps>
    </Weight>
    </Notes>
    <ButtonSkip/>
    <ButtonNext>
    - Takes you to next exercise
    - After the last pane the button must take you to Stats page
    - Everytime we click on button next we save that data with WorkoutEntry that is already created in index.tsx
    </ButtonNext>
</NExercise>

You can get the data in Exercises.json
