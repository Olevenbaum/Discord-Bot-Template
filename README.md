# Discord-Bot

Discord bot template for discord.js v14

To get your bot up and running, just add a `configuration.json` file in the main directory.

You can add multiple bot applications to the configuration file. To choose which one you would like to start just use the argument `-application <application-index>` in the terminal.

The file should be orientated at the following format:

    {
        "applications": [
            {
                "applicationId": "your-application-id",
                "publicKey": "your-public-key",
                "token": "your-token"
            }
        ]
    }

Feel free to make changes whereever you want and modify this template to make it fit your bot application. If you want to publish an aplication based on this template, make sure to read the license. Please do not hesitate using this template nevertheless, that is what it is for. The license just makes sure that commercial applications based on this template cannot claim these scripts as theirs.
If there are any errors while executing the scripts, please contact me or create an issue and i will try to fix it. I always want this template to work best since i also work on some bots based on it.

To control the application commands manually you can use the scripts in the directory `management`. The script `resetApplicationCommands.js` will unregister all application commands to then register them again.

There are two predefined scripts you can use to control your application:

-   `resetApplicationCommands`: This executes the file `resetApplicationCommands.js`.
-   `start`: This executes the main file of the application, `application.js`.

All scripts can be executed in the console by entering `npm run <script>`.

For further information and details visit the [template's wiki](https://github.com/Olevenbaum/Discord-Bot-Template/wiki).

You can check my code at my [GitHub Repository](https://github.com/Olevenbaum/Dark-Olevenbaum "GitHub repository for browsing code") and some other projects of mine or even bots based on this template.
