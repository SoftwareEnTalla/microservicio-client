/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateClientCommand } from "../updateclient.command";
import { ClientCommandService } from "../../services/clientcommand.service";

@CommandHandler(UpdateClientCommand)
export class UpdateClientHandler
  implements ICommandHandler<UpdateClientCommand>
{
  constructor(
    private readonly commandService: ClientCommandService
  ) {}
  async execute(command: UpdateClientCommand) {
    if ("update" === "create") {
      return await this.commandService.create(command.payload);
    }
    if ("update" === "update") {
      const id = String(command.payload?.id ?? command.id ?? '');
      return await this.commandService.update(id, command.payload);
    }
    const id = String(command.payload?.id ?? command.id ?? '');
    return await this.commandService.delete(id);
  }
}
