# Application Extensions

This folder was created for application extensions to integrate.  You can use this folder, or create one in the name of your application.

## Integrating

Edit the `../Config/ts` to change development configuration items.  Environment variables in the higher environments will come from the environment variables.

Secondly, you'll need to add you routes.  THis is done in `../index.ts`.

Once that is done, you modules should load.  When needing classes / resources from the base application, reference them in your code.  Avoid adding to the `tre` folders or their descendants.  The better approach would be to 1) structure your system to not need the modification of TRE, 2) refactor TRE to be more modular, or 3) copy the needed item from TRE and override it in your application.

Number three has disadvantages: the override instance will not have affect outside your system.  That would require refactoring.

## Refactoring

Refactoring will introduce breaking changes.  Please submit pull request for refactoring that result in a more module base code.

## Help Needed

The following is a list of areas where improvement, enhancement, or remediation could be used.

- Lists
  - List Filtering - basic framework plumbed through; need filters implemented so the DB will filter
  - List Results - need default sorting, and the ability to sort per column
- Database Connections
  - We should have one connection for the web application and logging.
  - Each call to a route should have a dedicated connection for that call.
  - Might need a way to define the EntityDataSource object to be instantiated and passed as a type.  A constructor object?  We could then instantiate this in the web application and inject it everywhere.
