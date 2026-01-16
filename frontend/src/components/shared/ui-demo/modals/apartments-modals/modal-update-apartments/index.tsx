import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function ModalUpdateBuildings() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <button className="bg-gray-100 px-2 py-1 rounded-[3px] leading-5">Изменять</button>
        </DialogTrigger>
        <DialogContent>
          
        </DialogContent>
      </form>
    </Dialog>
  )
}
