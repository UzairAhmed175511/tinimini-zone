import cv2, numpy as np, sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
img = cv2.cvtColor(np.array(Image.open(src).convert('RGB')), cv2.COLOR_RGB2BGR)
h,w = img.shape[:2]
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
H,S,V = cv2.split(hsv)
green = ((H>=30)&(H<=95)&(S>=50)&(V>=25)).astype(np.uint8)
green = cv2.morphologyEx(green, cv2.MORPH_OPEN, np.ones((3,3),np.uint8))
mask = np.where(green==1, cv2.GC_PR_BGD, cv2.GC_PR_FGD).astype(np.uint8)
# definite bg: strongly green
strong = ((H>=35)&(H<=90)&(S>=90)).astype(np.uint8)
mask[strong==1]=cv2.GC_BGD
bgd=np.zeros((1,65),np.float64); fgd=np.zeros((1,65),np.float64)
cv2.grabCut(img, mask, None, bgd, fgd, 4, cv2.GC_INIT_WITH_MASK)
fg = np.where((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD),1,0).astype(np.uint8)
# keep largest components (product + hanger), drop specks
n,lab,st,_ = cv2.connectedComponentsWithStats(fg,8)
keep=np.zeros_like(fg)
areas=sorted([(st[i,cv2.CC_STAT_AREA],i) for i in range(1,n)],reverse=True)
big=areas[0][0] if areas else 0
top=areas[0][1] if areas else 0
for a,i in areas:
    x,y,ww,hh=st[i,0],st[i,1],st[i,2],st[i,3]
    touches = y<=2 or y+hh>=h-2 or x<=2 or x+ww>=w-2
    if i==top or (a>=0.05*big and not touches): keep[lab==i]=1
# fill holes
cnts,_=cv2.findContours(keep,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
filled=np.zeros_like(keep); cv2.drawContours(filled,cnts,-1,1,-1)
# holes that are green stay bg
filled[(strong==1)&(filled==1)&(keep==0)]=0
alpha=cv2.GaussianBlur((filled*255).astype(np.uint8),(5,5),0).astype(np.float32)/255
out=(img*alpha[...,None]+255*(1-alpha[...,None])).astype(np.uint8)
ys,xs=np.where(filled>0); y0,y1,x0,x1=ys.min(),ys.max(),xs.min(),xs.max()
crop=out[y0:y1+1,x0:x1+1]
ch,cw=crop.shape[:2]; side=int(max(ch,cw)*1.12)
canvas=np.full((side,side,3),255,np.uint8)
oy=(side-ch)//2; ox=(side-cw)//2; canvas[oy:oy+ch,ox:ox+cw]=crop
im=Image.fromarray(cv2.cvtColor(canvas,cv2.COLOR_BGR2RGB)).resize((1200,1200),Image.LANCZOS)
im.save(dst,quality=93)
